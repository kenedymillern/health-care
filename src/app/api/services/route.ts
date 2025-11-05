import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Service } from '@/types';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '5');
    const search = url.searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const query: any = {};
    if (search.trim()) {
      query.title = { $regex: search, $options: 'i' };
    }

    const servicesCollection = db.collection<Service>('services');

    const totalCount = await servicesCollection.countDocuments(query);

    const services = await servicesCollection
      .find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ services, totalCount }, { status: 200 });
  } catch (error) {
    console.error('GET /api/services error:', error);
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
    console.error('POST /api/services error:', error);
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

    const result = await db
      .collection<Service>('services')
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    if (!result || !('value' in result) || !result.value) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(result.value, { status: 200 });
  } catch (error) {
    console.error('PUT /api/services error:', error);
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

    const result = await db
      .collection<Service>('services')
      .deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/services error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
