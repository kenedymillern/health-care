import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Review } from '@/types';

export async function GET() {
    try {
        const db = await connectToDatabase();
        const reviews = await db.collection<Review>('reviews').find({}).toArray();
        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const db = await connectToDatabase();
        const body: Review = await req.json();
        if (body.rating < 1 || body.rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }
        const review = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await db.collection<Review>('reviews').insertOne(review);
        return NextResponse.json({ ...review, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}