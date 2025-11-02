import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signAdminToken, COOKIE_NAME, MAX_AGE } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    const db = await connectToDatabase();
    const admin = await db.collection("admins").findOne({ email });

    if (!admin)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signAdminToken(admin.email);
    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
