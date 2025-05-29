import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import session from "express-session";
import { storage } from "./storage.js";
import { requireAuth, comparePasswords, createDefaultAdmin } from "./auth.js";
import { insertReviewSchema, insertContactMessageSchema, insertCertificateSchema, insertProjectSchema, admins } from "../shared/schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Configure multer for serverless environments
const upload = multer({
  storage: process.env.VERCEL 
    ? multer.memoryStorage() // Use memory storage for serverless
    : multer.diskStorage({
        destination: async (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), "uploads");
          try {
            await fs.mkdir(uploadPath, { recursive: true });
          } catch (error) {
            // Directory might already exist
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
        },
      }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session management compatible with serverless
  if (process.env.VERCEL) {
    const MemoryStore = require('memorystore')(session);
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-here',
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax' as const
      }
    }));
  } else {
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-here',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax' as const
      }
    }));
  }

  // Create default admin on startup
  await createDefaultAdmin();

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
      
      if (admin.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await comparePasswords(password, admin[0].password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = admin[0].id;
      req.session.username = admin[0].username;
      
      res.json({ 
        success: true,
        user: { username: admin[0].username }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.session && req.session.adminId) {
      res.json({ username: req.session.username });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Quick admin access route for direct login
  app.get("/admin-quick", (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quick Admin Login</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
          button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background: #0056b3; }
          .info { background: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="info">
          <h3>دخول الإدارة السريع</h3>
          <p>أدخل بيانات تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>
        
        <form onsubmit="login(event)">
          <div class="form-group">
            <label>اسم المستخدم:</label>
            <input type="text" id="username" value="" required>
          </div>
          <div class="form-group">
            <label>كلمة المرور:</label>
            <input type="password" id="password" value="" required>
          </div>
          <button type="submit">دخول</button>
        </form>

        <script>
          async function login(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
              });
              
              if (response.ok) {
                window.location.href = '/#/admin';
              } else {
                alert('خطأ في تسجيل الدخول');
              }
            } catch (error) {
              alert('خطأ في الاتصال');
            }
          }
        </script>
      </body>
      </html>
    `);
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Certificate routes
  app.get("/api/certificates", async (_req, res) => {
    try {
      const certificates = await storage.getCertificates();
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ message: "Failed to fetch certificates" });
    }
  });

  app.post("/api/certificates", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const certificateData = {
        title: req.body.title,
        description: req.body.description,
        issueDate: req.body.issueDate,
        imageUrl,
      };

      const validatedData = insertCertificateSchema.parse(certificateData);
      const certificate = await storage.createCertificate(validatedData);
      res.json(certificate);
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create certificate" 
      });
    }
  });

  app.delete("/api/certificates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCertificate(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      res.status(500).json({ message: "Failed to delete certificate" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (_req, res) => {
    try {
      const reviews = await storage.getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/all", requireAuth, async (_req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create review" 
      });
    }
  });

  app.patch("/api/reviews/:id/approve", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.approveReview(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ message: "Failed to approve review" });
    }
  });

  app.delete("/api/reviews/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Contact message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to send message" 
      });
    }
  });

  app.get("/api/contact/messages", requireAuth, async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.put("/api/contact/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getVisibleProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/all", requireAuth, async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const technologies = req.body.technologies ? 
        req.body.technologies.split(',').map((tech: string) => tech.trim()) : [];

      const projectData = {
        title: req.body.title,
        description: req.body.description,
        imageUrl,
        technologies,
        liveUrl: req.body.liveUrl,
        githubUrl: req.body.githubUrl,
        isVisible: req.body.isVisible === 'true',
      };

      const validatedData = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create project" 
      });
    }
  });

  app.put("/api/projects/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      
      const technologies = req.body.technologies ? 
        req.body.technologies.split(',').map((tech: string) => tech.trim()) : undefined;

      const updateData: any = {
        title: req.body.title,
        description: req.body.description,
        technologies,
        liveUrl: req.body.liveUrl,
        githubUrl: req.body.githubUrl,
        isVisible: req.body.isVisible === 'true',
      };

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      const project = await storage.updateProject(id, updateData);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to update project" 
      });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}