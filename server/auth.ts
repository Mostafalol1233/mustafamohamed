import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { admins } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return await bcrypt.compare(supplied, stored);
}

export async function createDefaultAdmin() {
  try {
    // Check if any admin exists
    const existingAdmin = await db.select().from(admins).limit(1);
    
    if (existingAdmin.length === 0) {
      // Create default admin with username: admin, password: admin123
      const hashedPassword = await hashPassword('admin123');
      await db.insert(admins).values({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin created: username=admin, password=admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.adminId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    username?: string;
  }
}