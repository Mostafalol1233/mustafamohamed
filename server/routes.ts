import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { authenticateAdmin, requireAdminAuth } from "./adminAuth";
import session from "express-session";
import { insertReviewSchema, insertContactMessageSchema, insertCertificateSchema, insertProjectSchema, insertNotificationSchema, type InsertAnalytics } from "@shared/schema";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

const upload = multer({
  storage: multer.diskStorage({
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
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for admin auth
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Auth routes - simplified for admin only
  app.get('/api/auth/user', (req: any, res) => {
    if ((req.session as any)?.adminAuthenticated) {
      res.json({ isAuthenticated: true, isAdmin: true });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Certificate routes
  app.get("/api/certificates", async (req, res) => {
    try {
      const certificates = await storage.getCertificates();
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ message: "Failed to fetch certificates" });
    }
  });

  app.post("/api/certificates", requireAdminAuth, upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const certificateData = {
        title: req.body.title,
        description: req.body.description,
        issueDate: req.body.issueDate,
        imageUrl
      };

      const validatedData = insertCertificateSchema.parse(certificateData);
      const certificate = await storage.createCertificate(validatedData as any);
      res.json(certificate);
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create certificate" });
    }
  });

  app.delete("/api/certificates/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCertificate(id);
      res.json({ message: "Certificate deleted successfully" });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      res.status(500).json({ message: "Failed to delete certificate" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Development endpoint to auto-approve recent reviews
  app.post("/api/reviews/auto-approve", async (req, res) => {
    try {
      const allReviews = await storage.getAllReviews();
      const unapprovedReviews = allReviews.filter(review => !review.isApproved);
      
      for (const review of unapprovedReviews) {
        await storage.approveReview(review.id);
      }
      
      res.json({ message: `Auto-approved ${unapprovedReviews.length} reviews` });
    } catch (error) {
      console.error("Error auto-approving reviews:", error);
      res.status(500).json({ message: "Failed to auto-approve reviews" });
    }
  });

  app.get("/api/reviews/all", requireAdminAuth, async (req, res) => {
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
      const review = await storage.createReview(validatedData as any);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create review" });
    }
  });

  app.patch("/api/reviews/:id/approve", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.approveReview(id);
      res.json({ message: "Review approved successfully" });
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ message: "Failed to approve review" });
    }
  });

  app.delete("/api/reviews/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Contact message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData as any);
      res.json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to send message" });
    }
  });

  app.get("/api/contact", requireAdminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/contact/:id/read", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.json({ message: "Message marked as read successfully" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getVisibleProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/all", requireAdminAuth, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", requireAdminAuth, upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const projectData = {
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies ? JSON.parse(req.body.technologies) : [],
        liveUrl: req.body.liveUrl,
        githubUrl: req.body.githubUrl,
        imageUrl,
        isVisible: req.body.isVisible !== undefined ? req.body.isVisible === 'true' : true
      };

      const validatedData = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validatedData as any);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create project" });
    }
  });

  app.delete("/api/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.patch("/api/projects/:id", requireAdminAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      
      const projectData: any = {
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies ? JSON.parse(req.body.technologies) : undefined,
        liveUrl: req.body.liveUrl,
        githubUrl: req.body.githubUrl,
        isVisible: req.body.isVisible !== undefined ? req.body.isVisible === 'true' : undefined
      };

      if (imageUrl) {
        projectData.imageUrl = imageUrl;
      }

      // Remove undefined values
      Object.keys(projectData).forEach(key => 
        projectData[key] === undefined && delete projectData[key]
      );

      const project = await storage.updateProject(id, projectData);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update project" });
    }
  });

  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getActiveNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/all", requireAdminAuth, async (req, res) => {
    try {
      const notifications = await storage.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData as any);
      res.json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.updateNotification(id, req.body);
      res.json(notification);
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  app.delete("/api/notifications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNotification(id);
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const isValid = await authenticateAdmin(email, password);
      
      if (isValid) {
        (req.session as any).adminAuthenticated = true;
        res.json({ message: "Login successful", admin: true });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminAuthenticated = false;
    res.json({ message: "Logout successful" });
  });

  // Admin Data Routes
  app.get("/api/admin/reviews", requireAdminAuth, async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/admin/contact", requireAdminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/admin/reviews/:id/approve", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.approveReview(id);
      res.json({ message: "Review approved successfully" });
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ message: "Failed to approve review" });
    }
  });

  app.delete("/api/admin/reviews/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Analytics routes
  app.post("/api/analytics", async (req, res) => {
    try {
      const { eventType, eventData } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      const event = await storage.createAnalyticsEvent({
        eventType: eventType || 'unknown',
        eventData: eventData || null,
        ipAddress,
        userAgent,
      } as InsertAnalytics);
      res.json(event);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(500).json({ message: "Failed to create analytics event" });
    }
  });

  app.get("/api/admin/analytics", requireAdminAuth, async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const analytics = await storage.getAnalytics(days);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/analytics/summary", requireAdminAuth, async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
