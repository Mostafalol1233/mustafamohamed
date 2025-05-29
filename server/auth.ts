import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";

const scryptAsync = promisify(scrypt);

// Admin credentials - change these to your desired username/password
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_HASH = "your-hashed-password"; // Will be set below

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Initialize admin password hash
let adminPasswordHash: string;

async function initializeAdmin() {
  // Default admin password is "admin123" - change this!
  adminPasswordHash = await hashPassword("admin123");
}

export async function setupAuth(app: Express) {
  await initializeAdmin();

  const sessionSecret = process.env.SESSION_SECRET || "your-secret-key";
  
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  app.use(session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }));

  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    if (username === ADMIN_USERNAME && await comparePasswords(password, adminPasswordHash)) {
      (req.session as any).isAuthenticated = true;
      (req.session as any).user = { username: ADMIN_USERNAME };
      return res.json({ success: true, user: { username: ADMIN_USERNAME } });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  });

  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if ((req.session as any)?.isAuthenticated) {
      return res.json((req.session as any).user);
    }
    return res.status(401).json({ message: "Not authenticated" });
  });
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any)?.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
}