import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ loggedIn: false });

  const payload = await verifyAdminToken(token);
  if (!payload) return NextResponse.json({ loggedIn: false });

  return NextResponse.json({ loggedIn: true, email: payload.email });
}
