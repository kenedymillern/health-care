import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;
const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "admin_token";
const MAX_AGE = Number(process.env.ADMIN_COOKIE_MAX_AGE || 3600);

export type AdminToken = {
  email: string;
  iat?: number;
  exp?: number;
};

export function signAdminToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: `${MAX_AGE}s` });
}

export function verifyAdminToken(token: string): AdminToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminToken;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, MAX_AGE };
