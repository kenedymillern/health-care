import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;
const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "admin_token";
const MAX_AGE = Number(process.env.ADMIN_COOKIE_MAX_AGE || 604800); // default 7 days

export type AdminToken = {
  email: string;
  iat?: number;
  exp?: number;
};

export function signAdminToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: `${MAX_AGE}s` });
}

/**
 * Verifies the admin token.
 * If invalid or expired, clears the cookie automatically.
 */
export async function verifyAdminToken(token: string): Promise<AdminToken | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminToken;
    return decoded;
  } catch (error) {
    const cookieStore = await cookies();

    // Clear expired/invalid token cookie
    cookieStore.set({
      name: COOKIE_NAME,
      value: "",
      expires: new Date(0), // expire immediately
      path: "/",
    });

    if (error instanceof TokenExpiredError) {
      // console.warn("Admin token expired, clearing cookie");
    } else if (error instanceof JsonWebTokenError) {
      // console.warn("Invalid admin token, clearing cookie");
    } else {
      // console.error("Unexpected token verification error:", error);
    }

    return null;
  }
}

export { COOKIE_NAME, MAX_AGE };
