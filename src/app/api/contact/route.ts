import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Contact } from "@/types";
import { z } from "zod";
import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import Redis from "ioredis";
import axios from "axios";
import retry from "async-retry";
import sanitizeHtml from "sanitize-html"; // Import sanitize-html

// Sanitization configuration
const sanitizeOptions = {
  allowedTags: [], // Remove all HTML tags
  allowedAttributes: {}, // Remove all attributes
};

// Define Zod schema for validation with regex for name
const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be 20 characters or less")
    .optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be 1000 characters or less"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

// Initialize rate limiter
let rateLimiter: RateLimiterRedis | RateLimiterMemory;

const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      reconnectOnError: (err) => {
        console.error("Redis reconnect error:", err);
        return true;
      },
      retryStrategy: (times) => Math.min(times * 100, 3000),
    })
  : null;

if (redisClient) {
  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });
  redisClient.on("connect", () => {
    console.log("Redis connected");
  });
  redisClient.on("ready", () => {
    console.log("Redis ready");
  });

  try {
    await retry(
      async () => {
        await redisClient.ping();
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (err, attempt) => {
          console.warn(`Redis connection attempt ${attempt} failed:`, err);
        },
      }
    );
    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      points: 5,
      duration: 60,
      keyPrefix: "rate-limiter-contact",
    });
    console.log("Rate limiting with Redis initialized");
  } catch (err) {
    console.error("Failed to initialize Redis rate limiter:", err);
    console.warn("Falling back to in-memory rate limiting");
    rateLimiter = new RateLimiterMemory({
      points: 5,
      duration: 60,
    });
  }
} else {
  console.warn("REDIS_URL not set, using in-memory rate limiting");
  rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
  });
}

// Verify reCAPTCHA v2 token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success } = response.data;
    if (!success) {
      console.warn(`reCAPTCHA verification failed: ${JSON.stringify(response.data)}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    console.log(`Processing request from IP: ${ip}`);

    // Apply rate limiting
    try {
      await rateLimiter.consume(ip);
      console.log(
        `Rate limit applied for IP: ${ip}, remaining: ${(await rateLimiter.get(ip))?.remainingPoints}`
      );
    } catch (rateLimiterError) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    const db = await connectToDatabase();
    const body = await req.json();

    // Sanitize inputs before validation
    const sanitizedName = sanitizeHtml(body.name, sanitizeOptions);
    const sanitizedMessage = sanitizeHtml(body.message, sanitizeOptions);

    // Validate request body with Zod
    const parsed = contactSchema.safeParse({
      name: sanitizedName,
      email: body.email,
      phone: body.phone,
      message: sanitizedMessage,
      recaptchaToken: body.recaptchaToken,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const { recaptchaToken, ...contactData } = parsed.data;
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    const contact: Contact = {
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Contact>("contacts").insertOne(contact);
    return NextResponse.json({ ...contact, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const contacts = await db.collection<Contact>("contacts").find({}).toArray();
    // Sanitize data before returning
    const sanitizedContacts = contacts.map((contact) => ({
      ...contact,
      name: sanitizeHtml(contact.name, sanitizeOptions),
      message: sanitizeHtml(contact.message, sanitizeOptions),
    }));
    return NextResponse.json(sanitizedContacts, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

// Gracefully disconnect Redis on process termination
process.on("SIGTERM", async () => {
  if (redisClient) {
    await redisClient.quit();
  }
});