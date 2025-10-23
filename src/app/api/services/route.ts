import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Service } from '@/types';
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await connectToDatabase();
    const services = await db.collection<Service>('services').find({}).toArray();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: Service = await req.json();
    const service = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Service>('services').insertOne(service);
    return NextResponse.json({ ...service, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: Service = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    // ✅ Explicitly type the result as the correct MongoDB type
    const result = await db
      .collection<Service>('services')
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    // ✅ TypeScript fix: result can be null or undefined
    if (!result || !('value' in result) || !result.value) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(result.value, { status: 200 });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }
    const result = await db.collection<Service>('services').deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}