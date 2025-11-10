import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Newsletter } from '@/types';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        // ---- pagination ----
        const skip = Math.max(0, parseInt(searchParams.get('skip') ?? '0', 10));
        const limit = Math.max(
            1,
            Math.min(100, parseInt(searchParams.get('limit') ?? '10', 10))
        );
        // ---- month filter (YYYY-MM) ----
        const filterDateByMonth = searchParams.get('filterDateByMonth');
        const search = searchParams.get('search');

        const db = await connectToDatabase();

        // ---- base query ----
        const query: any = {};

        // ---- text search on email ----
        if (search) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [{ email: regex }];
        }

        // ---- month range filter ----
        if (filterDateByMonth) {
            const [yearStr, monthStr] = filterDateByMonth.split('-');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);

            if (
                isNaN(year) ||
                isNaN(month) ||
                month < 1 ||
                month > 12 ||
                yearStr.length !== 4
            ) {
                return NextResponse.json(
                    { error: 'Invalid filterDateByMonth format. Use YYYY-MM.' },
                    { status: 400 }
                );
            }

            const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)); // first day 00:00 UTC
            const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));     // first day of next month

            query.createdAt = { $gte: start, $lt: end };
        }

        // ---- total count (for pagination UI) ----
        const total = await db.collection('newsletter').countDocuments(query);

        // ---- fetch paginated data ----
        const newsletter = await db
            .collection<Newsletter>('newsletter')
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return NextResponse.json(
            { total, data: newsletter },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Failed to get newsletter subscription', error.message);
        return NextResponse.json(
            { error: 'Failed to fetch newsletter subscription' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const db = await connectToDatabase()
        const body: Newsletter = await req.json()
        const newsletter = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const existing = await db.collection("newsletter").findOne({ email: body.email });

        if (existing) {
            return NextResponse.json({ error: "You have subscribed already!" }, { status: 409 });
        }
        const result = await db.collection<Newsletter>("newsletter").insertOne(newsletter)
        return NextResponse.json(
            { ...newsletter, _id: result.insertedId },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Failed to create newsletter subscription', error.message);
        return NextResponse.json(
            { error: 'Failed to create newsletter subscription' },
            { status: 500 }
        );
    }
}