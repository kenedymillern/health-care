import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { FAQ } from '@/types';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const faqs = await db.collection<FAQ>('faqs').find({}).toArray();
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: FAQ = await req.json();
    const faq = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<FAQ>('faqs').insertOne(faq);
    return NextResponse.json({ ...faq, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: FAQ = await req.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }
    const result = await db.collection<FAQ>('faqs').findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result || !('value' in result) || !result.value) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json(result.value, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }
    const result = await db.collection<FAQ>('faqs').deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'FAQ deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}