import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Service } from '@/types';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const db = await connectToDatabase();
    const service = await db.collection<Service>('services').findOne({ slug: params.slug });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}