import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Career } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const formData = await req.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const resume = formData.get('resume') as File;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !position || !message || !resume) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate file type (PDF or Word)
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

    // Validate file size (10MB = 10,485,760 bytes)
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    if (resume.size > maxFileSize) {
      return NextResponse.json({ error: 'File size must not exceed 10MB' }, { status: 400 });
    }

    // Save resume to public/uploads/resumes/
    const uploadDir = path.join(process.cwd(), 'public/uploads/resumes');
    await fs.mkdir(uploadDir, { recursive: true });
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const resumePath = `/uploads/resumes/${uniqueSuffix}-${resume.name}`;
    const filePath = path.join(uploadDir, `${uniqueSuffix}-${resume.name}`);
    const buffer = Buffer.from(await resume.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const careerData: Career = {
      fullName,
      email,
      phoneNumber,
      position,
      resume: resumePath,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Career>('careers').insertOne(careerData);
    return NextResponse.json({ ...careerData, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error submitting career application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const careers = await db.collection<Career>('careers').find({}).toArray();
    return NextResponse.json(careers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}