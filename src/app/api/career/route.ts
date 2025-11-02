import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CareerData } from "@/types";
import { z } from "zod";
import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import Redis from "ioredis";
import { v2 as cloudinary } from "cloudinary";
import retry from "async-retry";
import axios from "axios";
import sanitizeHtml from "sanitize-html";
import { ObjectId } from "mongodb";

// ==================== CONFIG ====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

// ==================== ZOD SCHEMA ====================
const careerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be 100 characters or less")
    .regex(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be 20 characters or less"),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must be 100 characters or less")
    .regex(/^[a-zA-Z\s]*$/, "Position can only contain letters and spaces"),
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
      keyPrefix: "rate-limiter-career",
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
  let publicId: string | null = null;

  try {
    // IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    console.log(`Processing request from IP: ${ip}`);

    const formData = await req.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const position = formData.get("position") as string;
    const message = formData.get("message") as string;
    const resume = formData.get("resume") as File;
    const recaptchaToken = formData.get("recaptchaToken") as string;

    // Sanitize text inputs
    const sanitizedFullName = sanitizeHtml(fullName, sanitizeOptions);
    const sanitizedPosition = sanitizeHtml(position, sanitizeOptions);
    const sanitizedMessage = sanitizeHtml(message, sanitizeOptions);

    // Zod validation
    const parsed = careerSchema.safeParse({
      fullName: sanitizedFullName,
      email,
      phoneNumber,
      position: sanitizedPosition,
      message: sanitizedMessage,
      recaptchaToken,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Resume validation
    if (!resume) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 });
    }
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedMimeTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: "Only PDF and Word (.doc, .docx) files are allowed" },
        { status: 400 }
      );
    }
    const maxFileSize = 10 * 1024 * 1024;
    if (resume.size > maxFileSize) {
      return NextResponse.json(
        { error: "File size must not exceed 10MB" },
        { status: 400 }
      );
    }

    // DB pre-check
    let db;
    try {
      db = await connectToDatabase();
      console.log("MongoDB connection validated");
    } catch (error) {
      console.error("MongoDB pre-check failed:", error);
      return NextResponse.json(
        { error: "Database unavailable, please try again later" },
        { status: 503 }
      );
    }

    // Sanitize file name
    const sanitizedResumeName = sanitizeHtml(resume.name, {
      ...sanitizeOptions,
      textFilter: (text: string) => text.replace(/[^a-zA-Z0-9-_]/g, "_"),
    });

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileBuffer = Buffer.from(await resume.arrayBuffer());

    // Cloudinary upload with retry
    const uploadResult = await retry(
      async () =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "resumes",
              public_id: `${uniqueSuffix}-${sanitizedResumeName}`,
              resource_type: "raw",
              type: "upload",
              allowed_formats: ["pdf", "doc", "docx"],
              access_mode: "public",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          uploadStream.end(fileBuffer);
        }),
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (err, attempt) => {
          console.warn(`Cloudinary upload attempt ${attempt} failed:`, err);
        },
      }
    );

    const resumeUrl = (uploadResult as any).secure_url;
    publicId = (uploadResult as any).public_id;
    if (!resumeUrl || !publicId) throw new Error("Invalid Cloudinary response");
    console.log(`Cloudinary upload successful: ${resumeUrl}`);

    // Save to MongoDB
    const careerData: CareerData = {
      fullName: sanitizedFullName,
      email,
      phoneNumber,
      position: sanitizedPosition,
      resume: resumeUrl,
      message: sanitizedMessage,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<CareerData>("careers").insertOne(careerData);
    console.log(`MongoDB insertion successful: ${result.insertedId}`);

    // Apply rate limit
    try {
      await rateLimiter.consume(ip);
      console.log(`Rate limit applied for IP: ${ip}`);
    } catch (rateLimiterError) {
      console.warn(`Rate limiter error for IP: ${ip}`, rateLimiterError);
    }

    return NextResponse.json(
      { ...careerData, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting career application:", error);

    // Cleanup uploaded file
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        console.log(`Cleaned up Cloudinary file: ${publicId}`);
      } catch (cleanupError) {
        console.warn(`Failed to clean up Cloudinary file ${publicId}:`, cleanupError);
      }
    }

    if (error.message?.includes("Cloudinary")) {
      return NextResponse.json(
        { error: "Failed to upload resume to Cloudinary" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// ==================== GET (with pagination & filters) ====================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(0, parseInt(searchParams.get("skip") || "0"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = await connectToDatabase();
    const query: any = {};

    if (status && ["new", "reviewed", "archived"].includes(status)) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { fullName: regex },
        { email: regex },
        { position: regex },
      ];
    }

    const total = await db.collection("careers").countDocuments(query);
    const careers = await db
      .collection<CareerData>("careers")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const sanitizedCareers = careers.map((c) => ({
      ...c,
      fullName: sanitizeHtml(c.fullName, sanitizeOptions),
      position: sanitizeHtml(c.position, sanitizeOptions),
      message: sanitizeHtml(c.message, sanitizeOptions),
    }));

    return NextResponse.json({ total, data: sanitizedCareers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// ==================== PATCH (update status) ====================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !["reviewed", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const update: any = {
      status,
      updatedAt: new Date(),
    };
    if (status === "reviewed") update.processedAt = new Date();
    if (status === "archived") update.archivedAt = new Date();

    const result = await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 200 });
    }

    return NextResponse.json({ success: true, status }, { status: 200 });
  } catch (error) {
    console.error("Error updating career status:", error);
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