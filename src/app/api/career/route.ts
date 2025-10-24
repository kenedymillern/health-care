import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CareerData } from '@/types';
import { z } from 'zod';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { v2 as cloudinary } from 'cloudinary';
import retry from 'async-retry';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Define Zod schema for validation
const careerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be 100 characters or less'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().min(8, 'Phone number must be at least 8 characters').max(20, 'Phone number must be 20 characters or less'),
  position: z.string().min(2, 'Position must be at least 2 characters').max(100, 'Position must be 100 characters or less'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be 1000 characters or less'),
});

// Initialize rate limiter
let rateLimiter: RateLimiterRedis | RateLimiterMemory;

// Configure Redis client with retry
const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      reconnectOnError: (err) => {
        console.error('Redis reconnect error:', err);
        return true;
      },
      retryStrategy: (times) => Math.min(times * 100, 3000),
    })
  : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  redisClient.on('connect', () => {
    console.log('Redis connected');
  });
  redisClient.on('ready', () => {
    console.log('Redis ready');
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
      keyPrefix: 'rate-limiter-career',
    });
    console.log('Rate limiting with Redis initialized');
  } catch (err) {
    console.error('Failed to initialize Redis rate limiter:', err);
    console.warn('Falling back to in-memory rate limiting');
    rateLimiter = new RateLimiterMemory({
      points: 5,
      duration: 60,
    });
  }
} else {
  console.warn('REDIS_URL not set, using in-memory rate limiting');
  rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
  });
}

export async function POST(req: NextRequest) {
  let publicId: string | null = null; // Track Cloudinary public_id for cleanup

  try {
    // Get client IP for rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') || 'unknown';
    console.log(`Processing request from IP: ${ip}`);

    const formData = await req.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const resume = formData.get('resume') as File;

    // Validate form fields with Zod
    const parsed = careerSchema.safeParse({
      fullName,
      email,
      phoneNumber,
      position,
      message,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Validate resume file
    if (!resume) {
      return NextResponse.json({ error: 'Resume is required' }, { status: 400 });
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: 'Only PDF and Word (.doc, .docx) files are allowed' },
        { status: 400 }
      );
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    if (resume.size > maxFileSize) {
      return NextResponse.json({ error: 'File size must not exceed 10MB' }, { status: 400 });
    }

    // Validate MongoDB connection before upload
    let db;
    try {
      db = await connectToDatabase();
      console.log('MongoDB connection validated');
    } catch (error) {
      console.error('MongoDB pre-check failed:', error);
      return NextResponse.json({ error: 'Database unavailable, please try again later' }, { status: 503 });
    }

    // Upload resume to Cloudinary with retry
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileBuffer = Buffer.from(await resume.arrayBuffer());
    const uploadResult = await retry(
      async () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'resumes',
              upload_preset: 'public_resumes',
              public_id: `${uniqueSuffix}-${resume.name}`,
              resource_type: 'raw',
              type: 'upload', 
              allowed_formats: ['pdf', 'doc', 'docx'],
              access_mode: 'public',
              transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(fileBuffer);
        });
      },
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

    // Validate Cloudinary response
    const resumeUrl = (uploadResult as any).secure_url;
    publicId = (uploadResult as any).public_id;
    if (!resumeUrl || !publicId) {
      throw new Error('Invalid Cloudinary response');
    }
    console.log(`Cloudinary upload successful: ${resumeUrl}`);

    const careerData: CareerData = {
      fullName,
      email,
      phoneNumber,
      position,
      resume: resumeUrl,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    try {
      const result = await db.collection<CareerData>('careers').insertOne(careerData);
      console.log(`MongoDB insertion successful: ${result.insertedId}`);

      // Apply rate limiting only on successful submission
      try {
        await rateLimiter.consume(ip);
        console.log(`Rate limit applied for IP: ${ip}, remaining: ${(await rateLimiter.get(ip))?.remainingPoints}`);
      } catch (rateLimiterError) {
        console.warn(`Rate limiter error after successful submission for IP: ${ip}`, rateLimiterError);
      }

      return NextResponse.json({ ...careerData, _id: result.insertedId }, { status: 201 });
    } catch (error) {
      console.error('MongoDB insertion failed:', error);
      // Clean up Cloudinary file
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
          console.log(`Cleaned up Cloudinary file: ${publicId}`);
        } catch (cleanupError) {
          console.warn(`Failed to clean up Cloudinary file ${publicId}:`, cleanupError);
        }
      }
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error submitting career application:', error);
    // Clean up Cloudinary file on any error
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log(`Cleaned up Cloudinary file: ${publicId}`);
      } catch (cleanupError) {
        console.warn(`Failed to clean up Cloudinary file ${publicId}:`, cleanupError);
      }
    }
    if (error.message.includes('Cloudinary')) {
      return NextResponse.json({ error: 'Failed to upload resume to Cloudinary' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const careers = await db.collection<CareerData>('careers').find({}).toArray();
    return NextResponse.json(careers, { status: 200 });
  } catch (error) {
    console.error('Error fetching career applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// Gracefully disconnect Redis on process termination
process.on('SIGTERM', async () => {
  if (redisClient) {
    await redisClient.quit();
  }
});