import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // verify the logged-in admin via cookie
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const existing = await db.collection("admins").findOne({ email });

    if (existing) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.collection("admins").insertOne({
      email,
      password: hash,
      createdAt: new Date(),
      createdBy: payload.email,
    });

    return NextResponse.json({ ok: true, message: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
