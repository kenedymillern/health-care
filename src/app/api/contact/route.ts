import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Contact } from '@/types';
import { z } from 'zod';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Define Zod schema for validation
const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
    email: z.string().email('Invalid email format'),
    phone: z.string().max(20, 'Phone number must be 20 characters or less').optional(),
    message: z.string().min(1, 'Message is required').max(1000, 'Message must be 1000 characters or less'),
});

// Initialize rate limiter: 5 requests per minute per IP
const rateLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 60, // per 60 seconds (1 minute)
});

export async function POST(req: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        // Apply rate limiting
        try {
            await rateLimiter.consume(ip);
        } catch (rateLimiterError) {
            return NextResponse.json(
                { error: 'Too many requests, please try again later' },
                { status: 429 }
            );
        }

        const db = await connectToDatabase();
        const body = await req.json();

        // Validate request body with Zod
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const contact: Contact = {
            ...parsed.data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await db.collection<Contact>('contacts').insertOne(contact);
        return NextResponse.json({ ...contact, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = await connectToDatabase();
        const contacts = await db.collection<Contact>('contacts').find({}).toArray();
        return NextResponse.json(contacts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}