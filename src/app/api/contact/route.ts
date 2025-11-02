import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Contact } from "@/types";
import { z } from "zod";
import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import Redis from "ioredis";
import axios from "axios";
import retry from "async-retry";
import sanitizeHtml from "sanitize-html";
import { ObjectId } from "mongodb";

// ==================== CONFIG ====================
const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

// ==================== ZOD SCHEMA ====================
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

// ==================== RATE LIMITER ====================
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
  redisClient.on("error", (err) => console.error("Redis connection error:", err));
  redisClient.on("connect", () => console.log("Redis connected"));
  redisClient.on("ready", () => console.log("Redis ready"));

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
    rateLimiter = new RateLimiterMemory({ points: 5, duration: 60 });
  }
} else {
  console.warn("REDIS_URL not set, using in-memory rate limiting");
  rateLimiter = new RateLimiterMemory({ points: 5, duration: 60 });
}

// ==================== RECAPTCHA ====================
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
    }
    return success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

// ==================== POST ====================
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    console.log(`Processing contact request from IP: ${ip}`);

    // Rate limiting
    try {
      await rateLimiter.consume(ip);
      console.log(`Rate limit applied for IP: ${ip}`);
    } catch (rateLimiterError) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    const db = await connectToDatabase();
    const body = await req.json();

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(body.name, sanitizeOptions);
    const sanitizedMessage = sanitizeHtml(body.message, sanitizeOptions);

    // Zod validation
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

    // reCAPTCHA
    const { recaptchaToken, ...contactData } = parsed.data;
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Save to DB
    const contact: Contact = {
      ...contactData,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Contact>("contacts").insertOne(contact);
    console.log(`Contact saved: ${result.insertedId}`);

    return NextResponse.json(
      { ...contact, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

// ==================== GET (Paginated + Search + Filter) ====================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(0, parseInt(searchParams.get("skip") || "0"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = await connectToDatabase();
    const query: any = {};

    if (status && ["new", "replied", "archived"].includes(status)) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { message: regex },
      ];
    }

    const total = await db.collection("contacts").countDocuments(query);
    const contacts = await db
      .collection<Contact>("contacts")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const sanitizedContacts = contacts.map((c) => ({
      ...c,
      name: sanitizeHtml(c.name, sanitizeOptions),
      message: sanitizeHtml(c.message, sanitizeOptions),
    }));

    return NextResponse.json(
      { total, data: sanitizedContacts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// ==================== PATCH (Update Status) ====================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !["replied", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const update: any = {
      status,
      updatedAt: new Date(),
    };
    if (status === "replied") update.repliedAt = new Date();
    if (status === "archived") update.archivedAt = new Date();

    const result = await db
      .collection("contacts")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status }, { status: 200 });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

// ==================== CLEANUP ====================
process.on("SIGTERM", async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log("Redis client quit on SIGTERM");
  }
});