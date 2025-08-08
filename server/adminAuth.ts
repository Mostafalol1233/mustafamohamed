import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { Request, Response, NextFunction } from "express";

const scryptAsync = promisify(scrypt);

// Default admin credentials - you can change these
const ADMIN_EMAIL = "admin@portfolio.com";
const ADMIN_PASSWORD = "admin123"; // Change this password!

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  if (email !== ADMIN_EMAIL) {
    return false;
  }
  
  // Simple password comparison for now (in production, use hashed passwords)
  return password === ADMIN_PASSWORD;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any)?.adminAuthenticated) {
    return res.status(401).json({ message: "Admin authentication required" });
  }
  next();
}