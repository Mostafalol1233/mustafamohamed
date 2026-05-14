import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { authenticateAdmin, requireAdminAuth } from "./adminAuth";
import session from "express-session";
import {
  insertReviewSchema,
  insertContactMessageSchema,
  insertCertificateSchema,
  insertProjectSchema,
  insertNotificationSchema,
  insertTestimonialSchema,
  insertSkillSchema,
  insertSiteSettingSchema,
  insertBlogPostSchema,
  type InsertAnalytics,
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), "uploads");
      try { await fs.mkdir(uploadPath, { recursive: true }); } catch {}
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portfolio-secret-key-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // ── Auth ────────────────────────────────────────────────────────────────────

  app.get("/api/auth/user", (req: any, res) => {
    if ((req.session as any)?.adminAuthenticated) {
      res.json({ isAuthenticated: true, isAdmin: true });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
      const isValid = await authenticateAdmin(email, password);
      if (isValid) {
        (req.session as any).adminAuthenticated = true;
        res.json({ message: "Login successful", admin: true });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (e) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminAuthenticated = false;
    res.json({ message: "Logout successful" });
  });

  // ── Certificates ─────────────────────────────────────────────────────────────

  app.get("/api/certificates", async (req, res) => {
    try { res.json(await storage.getCertificates()); }
    catch { res.status(500).json({ message: "Failed to fetch certificates" }); }
  });

  app.get("/api/certificates/all", requireAdminAuth, async (req, res) => {
    try {
      const all = await storage.getCertificates();
      res.json(all);
    } catch { res.status(500).json({ message: "Failed to fetch certificates" }); }
  });

  app.post("/api/certificates", requireAdminAuth, upload.single("image"), async (req, res) => {
    try {
      let imageUrl = null;
      if (req.file) imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.imageUrl?.trim()) imageUrl = req.body.imageUrl.trim();
      const validated = insertCertificateSchema.parse({ title: req.body.title, description: req.body.description, issueDate: req.body.issueDate, imageUrl });
      res.json(await storage.createCertificate(validated as any));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to create certificate" }); }
  });

  app.patch("/api/certificates/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      res.json(await storage.updateCertificate(id, req.body));
    } catch { res.status(500).json({ message: "Failed to update certificate" }); }
  });

  app.delete("/api/certificates/:id", requireAdminAuth, async (req, res) => {
    try { await storage.deleteCertificate(parseInt(req.params.id)); res.json({ message: "Deleted" }); }
    catch { res.status(500).json({ message: "Failed to delete certificate" }); }
  });

  // ── Reviews ──────────────────────────────────────────────────────────────────

  app.get("/api/reviews", async (req, res) => {
    try { res.json(await storage.getApprovedReviews()); }
    catch { res.status(500).json({ message: "Failed to fetch reviews" }); }
  });

  app.get("/api/reviews/all", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.getAllReviews()); }
    catch { res.status(500).json({ message: "Failed to fetch reviews" }); }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validated = insertReviewSchema.parse(req.body);
      res.json(await storage.createReview(validated as any));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to create review" }); }
  });

  app.patch("/api/reviews/:id/approve", requireAdminAuth, async (req, res) => {
    try { await storage.approveReview(parseInt(req.params.id)); res.json({ message: "Approved" }); }
    catch { res.status(500).json({ message: "Failed to approve review" }); }
  });

  app.delete("/api/reviews/:id", requireAdminAuth, async (req, res) => {
    try { await storage.deleteReview(parseInt(req.params.id)); res.json({ message: "Deleted" }); }
    catch { res.status(500).json({ message: "Failed to delete review" }); }
  });

  // ── Contact Messages ─────────────────────────────────────────────────────────

  app.post("/api/contact", async (req, res) => {
    try {
      const validated = insertContactMessageSchema.parse(req.body);
      res.json(await storage.createContactMessage(validated as any));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to send message" }); }
  });

  app.get("/api/contact", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.getContactMessages()); }
    catch { res.status(500).json({ message: "Failed to fetch messages" }); }
  });

  app.patch("/api/contact/:id/read", requireAdminAuth, async (req, res) => {
    try { await storage.markMessageAsRead(parseInt(req.params.id)); res.json({ message: "Marked as read" }); }
    catch { res.status(500).json({ message: "Failed to mark as read" }); }
  });

  app.delete("/api/contact/:id", requireAdminAuth, async (req, res) => {
    try { await storage.deleteContactMessage(parseInt(req.params.id)); res.json({ message: "Deleted" }); }
    catch { res.status(500).json({ message: "Failed to delete message" }); }
  });

  // ── Projects ─────────────────────────────────────────────────────────────────

  app.get("/api/projects", async (req, res) => {
    try { res.json(await storage.getVisibleProjects()); }
    catch { res.status(500).json({ message: "Failed to fetch projects" }); }
  });

  app.get("/api/projects/all", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.getAllProjects()); }
    catch { res.status(500).json({ message: "Failed to fetch projects" }); }
  });

  app.post("/api/projects", requireAdminAuth, upload.single("image"), async (req, res) => {
    try {
      let imageUrl = null;
      if (req.file) imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.imageUrl?.trim()) imageUrl = req.body.imageUrl.trim();
      let technologies: string[] = [];
      if (req.body.technologies) {
        if (Array.isArray(req.body.technologies)) technologies = req.body.technologies;
        else {
          try { technologies = JSON.parse(req.body.technologies); }
          catch { technologies = req.body.technologies.split(",").map((t: string) => t.trim()).filter(Boolean); }
        }
      }
      const validated = insertProjectSchema.parse({
        title: req.body.title, description: req.body.description, technologies,
        liveUrl: req.body.liveUrl, githubUrl: req.body.githubUrl, imageUrl,
        isVisible: req.body.isVisible !== undefined ? req.body.isVisible === "true" : true,
      });
      res.json(await storage.createProject(validated as any));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to create project" }); }
  });

  app.patch("/api/projects/:id", requireAdminAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let imageUrl: string | undefined;
      if (req.file) imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.imageUrl?.trim()) imageUrl = req.body.imageUrl.trim();
      let technologies: string[] | undefined;
      if (req.body.technologies !== undefined) {
        if (Array.isArray(req.body.technologies)) technologies = req.body.technologies;
        else {
          try { technologies = JSON.parse(req.body.technologies); }
          catch { technologies = req.body.technologies.split(",").map((t: string) => t.trim()).filter(Boolean); }
        }
      }
      const data: any = { title: req.body.title, description: req.body.description, technologies, liveUrl: req.body.liveUrl, githubUrl: req.body.githubUrl };
      if (imageUrl !== undefined) data.imageUrl = imageUrl;
      if (req.body.isVisible !== undefined) data.isVisible = req.body.isVisible === "true" || req.body.isVisible === true;
      Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
      res.json(await storage.updateProject(id, data));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to update project" }); }
  });

  app.delete("/api/projects/:id", requireAdminAuth, async (req, res) => {
    try { await storage.deleteProject(parseInt(req.params.id)); res.json({ message: "Deleted" }); }
    catch { res.status(500).json({ message: "Failed to delete project" }); }
  });

  // ── Notifications ─────────────────────────────────────────────────────────────

  app.get("/api/notifications", async (req, res) => {
    try { res.json(await storage.getActiveNotifications()); }
    catch { res.status(500).json({ message: "Failed to fetch notifications" }); }
  });

  app.get("/api/notifications/all", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.getAllNotifications()); }
    catch { res.status(500).json({ message: "Failed to fetch notifications" }); }
  });

  app.post("/api/notifications", requireAdminAuth, async (req, res) => {
    try {
      const validated = insertNotificationSchema.parse(req.body);
      res.json(await storage.createNotification(validated as any));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to create notification" }); }
  });

  app.patch("/api/notifications/:id", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.updateNotification(parseInt(req.params.id), req.body)); }
    catch { res.status(500).json({ message: "Failed to update notification" }); }
  });

  app.delete("/api/notifications/:id", requireAdminAuth, async (req, res) => {
    try { await storage.deleteNotification(parseInt(req.params.id)); res.json({ message: "Deleted" }); }
    catch { res.status(500).json({ message: "Failed to delete notification" }); }
  });

  // ── Testimonials ──────────────────────────────────────────────────────────────

  app.get("/api/testimonials", async (req, res) => {
    try { res.json(await storage.getVisibleTestimonials()); }
    catch { res.status(500).json({ message: "Failed to fetch testimonials" }); }
  });

  app.get("/api/testimonials/all", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.getAllTestimonials()); }
    catch { res.status(500).json({ message: "Failed to fetch testimonials" }); }
  });

  app.post("/api/testimonials", requireAdminAuth, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.parse(req.body);
      res.json(await storage.createTestimonial(validated as any));
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to create testimonial" }); }
  });

  app.patch("/api/testimonials/:id", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.updateTestimonial(parseInt(req.params.id), req.body)); }
    catch { res.status(500).json({ message: "Failed to update testimonial" }); }
  });

  app.delete("/api/testimonials/:id", requireAdminAuth, async (req, res) => {
    try { await storage.deleteTestimonial(parseInt(req.params.id)); res.json({ message: "Deleted" }); }
    catch { res.status(500).json({ message: "Failed to delete testimonial" }); }
  });

  // ── Skills ────────────────────────────────────────────────────────────────────

  app.get("/api/skills", async (req, res) => {
    try { res.json(await storage.getAllSkills()); }
    catch { res.status(500).json({ message: "Failed to fetch skills" }); }
  });

  app.patch("/api/skills/:id", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.updateSkill(parseInt(req.params.id), req.body)); }
    catch { res.status(500).json({ message: "Failed to update skill" }); }
  });

  // ── Site Settings ─────────────────────────────────────────────────────────────

  app.get("/api/site-settings", async (req, res) => {
    try { res.json(await storage.getAllSiteSettings()); }
    catch { res.status(500).json({ message: "Failed to fetch settings" }); }
  });

  app.patch("/api/site-settings/:key", requireAdminAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      res.json(await storage.upsertSiteSetting(key, value));
    } catch { res.status(500).json({ message: "Failed to update setting" }); }
  });

  // ── Analytics ─────────────────────────────────────────────────────────────────

  app.post("/api/analytics", async (req, res) => {
    try {
      const { eventType, eventData } = req.body;
      const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip || "unknown";
      const userAgent = req.headers["user-agent"] || "unknown";
      res.json(await storage.createAnalyticsEvent({ eventType: eventType || "unknown", eventData: eventData || null, ipAddress, userAgent } as any));
    } catch { res.status(500).json({ message: "Failed to record event" }); }
  });

  app.get("/api/admin/analytics", requireAdminAuth, async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      res.json(await storage.getAnalytics(days));
    } catch { res.status(500).json({ message: "Failed to fetch analytics" }); }
  });

  app.get("/api/admin/analytics/summary", requireAdminAuth, async (req, res) => {
    try { res.json(await storage.getAnalyticsSummary()); }
    catch { res.status(500).json({ message: "Failed to fetch analytics summary" }); }
  });

  // ── CSV Export ────────────────────────────────────────────────────────────────

  app.get("/api/admin/export/contacts", requireAdminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      const header = "ID,Name,Email,Subject,Message,Read,Date";
      const rows = messages.map(m =>
        [m.id, `"${m.name}"`, `"${m.email}"`, `"${(m.subject||"").replace(/"/g,'""')}"`, `"${m.message.replace(/"/g,'""')}"`, m.isRead ? "Yes" : "No", m.createdAt?.toISOString() || ""].join(",")
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
      res.send([header, ...rows].join("\n"));
    } catch { res.status(500).json({ message: "Export failed" }); }
  });

  app.get("/api/admin/export/reviews", requireAdminAuth, async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      const header = "ID,Name,Email,Rating,Comment,Approved,Date";
      const rows = reviews.map(r =>
        [r.id, `"${r.name}"`, `"${r.email||""}"`, r.rating, `"${r.comment.replace(/"/g,'""')}"`, r.isApproved ? "Yes" : "No", r.createdAt?.toISOString() || ""].join(",")
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=reviews.csv");
      res.send([header, ...rows].join("\n"));
    } catch { res.status(500).json({ message: "Export failed" }); }
  });

  // ── Password Change ───────────────────────────────────────────────────────────

  app.post("/api/admin/change-password", requireAdminAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both passwords required" });
      if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
      const { authenticateAdmin } = await import("./adminAuth");
      const isValid = await authenticateAdmin(process.env.ADMIN_EMAIL || "admin@portfolio.com", currentPassword);
      if (!isValid) return res.status(401).json({ message: "Current password is incorrect" });
      process.env.ADMIN_PASSWORD_OVERRIDE = newPassword;
      res.json({ message: "Password changed for this session. Set ADMIN_PASSWORD env var for permanent change." });
    } catch { res.status(500).json({ message: "Failed to change password" }); }
  });

  // ── Resume ────────────────────────────────────────────────────────────────────

  app.get("/api/resume", (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mustafa Mohamed — Resume</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-size: 13px; color: #1a1a2e; background: #fff; max-width: 780px; margin: 0 auto; padding: 40px; }
  .print-btn { display: flex; gap: 8px; justify-content: flex-end; margin-bottom: 24px; }
  .print-btn button { padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; }
  .btn-primary { background: #0f172a; color: #fff; }
  .btn-outline { background: transparent; border: 1px solid #e2e8f0 !important; color: #475569; }
  header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4f46e5; padding-bottom: 18px; margin-bottom: 22px; }
  .name { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }
  .title { font-size: 14px; color: #4f46e5; font-weight: 600; margin-top: 3px; }
  .contact-info { text-align: right; font-size: 12px; color: #475569; line-height: 1.8; }
  .contact-info a { color: #4f46e5; text-decoration: none; }
  section { margin-bottom: 20px; }
  h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 12px; }
  .summary { color: #374151; line-height: 1.65; font-size: 13px; }
  .experience-item { margin-bottom: 14px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-title { font-weight: 700; color: #0f172a; font-size: 13px; }
  .exp-company { color: #4f46e5; font-size: 12px; margin-top: 1px; }
  .exp-date { font-size: 11px; color: #6b7280; white-space: nowrap; }
  .exp-desc { margin-top: 5px; color: #374151; line-height: 1.6; font-size: 12px; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .tag { font-size: 10px; padding: 2px 8px; border-radius: 99px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; font-weight: 500; }
  .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .skill-category h3 { font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
  .skill-category p { font-size: 11px; color: #475569; line-height: 1.7; }
  .certs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .cert { padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 8px; }
  .cert-title { font-size: 12px; font-weight: 600; color: #0f172a; }
  .cert-issuer { font-size: 11px; color: #4f46e5; margin-top: 1px; }
  .cert-date { font-size: 10px; color: #6b7280; margin-top: 2px; }
  @media print { .print-btn { display: none !important; } body { padding: 0; } }
</style>
</head>
<body>
<div class="print-btn no-print">
  <button class="btn-outline" onclick="window.close()">Close</button>
  <button class="btn-primary" onclick="window.print()">🖨️ Download / Print PDF</button>
</div>

<header>
  <div>
    <div class="name">Mustafa Mohamed</div>
    <div class="title">Full-Stack Developer & Content Strategist</div>
  </div>
  <div class="contact-info">
    <div><a href="mailto:overthegardenwall317@gmail.com">overthegardenwall317@gmail.com</a></div>
    <div><a href="https://github.com/Bemora">github.com/Bemora</a></div>
    <div><a href="https://x.com/Bemora_BEMO">x.com/Bemora_BEMO</a></div>
    <div>Available for remote work</div>
  </div>
</header>

<section>
  <h2>Professional Summary</h2>
  <p class="summary">Full-stack developer and content strategist with 4+ years of experience building high-performance web applications. Specialized in React, Node.js, TypeScript, and PostgreSQL. Proven track record of delivering scalable, RTL-ready, mobile-first applications for clients across gaming, education, e-commerce, and sustainability sectors. Passionate about clean code, user experience, and measurable business impact.</p>
</section>

<section>
  <h2>Experience</h2>
  <div class="experience-item">
    <div class="exp-header">
      <div><div class="exp-title">Full-Stack Developer & Digital Strategist</div><div class="exp-company">Freelance / Bemora</div></div>
      <div class="exp-date">2021 – Present</div>
    </div>
    <div class="exp-desc">Designed and developed 12+ production web applications for international clients. Built RTL-ready, mobile-first interfaces using React and Tailwind CSS. Architected secure REST APIs with Node.js and PostgreSQL.</div>
    <div class="tags"><span class="tag">React</span><span class="tag">TypeScript</span><span class="tag">Node.js</span><span class="tag">PostgreSQL</span><span class="tag">Tailwind CSS</span><span class="tag">Drizzle ORM</span></div>
  </div>
  <div class="experience-item">
    <div class="exp-header">
      <div><div class="exp-title">Content Strategist & Video Producer</div><div class="exp-company">YouTube / Bemora Channel</div></div>
      <div class="exp-date">2022 – Present</div>
    </div>
    <div class="exp-desc">Created and managed educational content on web development and technology. Built audience engagement strategies and conversion-focused content pipelines.</div>
    <div class="tags"><span class="tag">Content Strategy</span><span class="tag">SEO</span><span class="tag">Video Production</span></div>
  </div>
</section>

<section>
  <h2>Key Projects</h2>
  <div class="experience-item">
    <div class="exp-header"><div><div class="exp-title">BRAVEZM Gaming Platform</div></div><div class="exp-date">2024</div></div>
    <div class="exp-desc">Full community gaming platform with tournament management, leaderboards, and RTL support. Built with React, Node.js, and PostgreSQL.</div>
  </div>
  <div class="experience-item">
    <div class="exp-header"><div><div class="exp-title">Ahmed Helly Academy</div></div><div class="exp-date">2023</div></div>
    <div class="exp-desc">Educational platform that doubled enrollment inquiries after launch. Features course management, student dashboard, and payment integration.</div>
  </div>
</section>

<section>
  <h2>Technical Skills</h2>
  <div class="skills-grid">
    <div class="skill-category"><h3>Frontend</h3><p>React, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Vite, RTL/i18n</p></div>
    <div class="skill-category"><h3>Backend</h3><p>Node.js, Express, PostgreSQL, Drizzle ORM, REST APIs, JWT, Sessions</p></div>
    <div class="skill-category"><h3>Tools & Platforms</h3><p>Git, Docker, Replit, Vercel, GitHub Actions, Figma, Canva</p></div>
  </div>
</section>

<section>
  <h2>Certifications</h2>
  <div class="certs">
    <div class="cert"><div class="cert-title">ALX AI Starter Kit</div><div class="cert-issuer">ALX Africa</div><div class="cert-date">2024</div></div>
    <div class="cert"><div class="cert-title">Full-Stack Web Development</div><div class="cert-issuer">Meta (Facebook)</div><div class="cert-date">2023</div></div>
    <div class="cert"><div class="cert-title">Content Strategy & Digital Marketing</div><div class="cert-issuer">Google</div><div class="cert-date">2023</div></div>
    <div class="cert"><div class="cert-title">Advanced JavaScript & TypeScript</div><div class="cert-issuer">Microsoft</div><div class="cert-date">2022</div></div>
    <div class="cert"><div class="cert-title">Cloud Computing Fundamentals</div><div class="cert-issuer">AWS</div><div class="cert-date">2022</div></div>
    <div class="cert"><div class="cert-title">Database Design & Management</div><div class="cert-issuer">Oracle</div><div class="cert-date">2021</div></div>
  </div>
</section>

<section>
  <h2>Languages</h2>
  <div class="tags"><span class="tag">Arabic — Native</span><span class="tag">English — Fluent (C1)</span></div>
</section>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });

  // ── Bulk Review Actions ───────────────────────────────────────────────────────

  app.post("/api/reviews/bulk-approve", requireAdminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) return res.status(400).json({ message: "ids must be an array" });
      await Promise.all(ids.map((id: number) => storage.approveReview(id)));
      res.json({ message: `${ids.length} reviews approved` });
    } catch { res.status(500).json({ message: "Bulk approve failed" }); }
  });

  app.post("/api/reviews/bulk-delete", requireAdminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) return res.status(400).json({ message: "ids must be an array" });
      await Promise.all(ids.map((id: number) => storage.deleteReview(id)));
      res.json({ message: `${ids.length} reviews deleted` });
    } catch { res.status(500).json({ message: "Bulk delete failed" }); }
  });

  // ── Blog Posts ────────────────────────────────────────────────────────────────

  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch { res.status(500).json({ message: "Failed to fetch posts" }); }
  });

  app.get("/api/blog/all", requireAdminAuth, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch { res.status(500).json({ message: "Failed to fetch posts" }); }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });
      res.json(post);
    } catch { res.status(500).json({ message: "Failed to fetch post" }); }
  });

  app.post("/api/blog", requireAdminAuth, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data as any);
      res.json(post);
    } catch (e: any) { res.status(400).json({ message: e.message || "Failed to create post" }); }
  });

  app.patch("/api/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch { res.status(500).json({ message: "Failed to update post" }); }
  });

  app.delete("/api/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBlogPost(parseInt(req.params.id));
      res.json({ message: "Deleted" });
    } catch { res.status(500).json({ message: "Failed to delete post" }); }
  });

  // ── Seed Default Data ─────────────────────────────────────────────────────────

  app.post("/api/admin/seed", requireAdminAuth, async (req, res) => {
    try {
      const existing = await storage.getAllProjects();
      if (existing.length === 0) {
        const defaultProjects = [
          { title: "BRAVEZM Gaming Platform", description: "Full community platform for esports with tournament management, leaderboards, and RTL support.", technologies: ["React", "Node.js", "PostgreSQL", "Tailwind"], liveUrl: "https://bravezm.com", githubUrl: null, isVisible: true },
          { title: "Ahmed Helly Academy", description: "Educational platform that doubled enrollment inquiries after launch. Features course management and student dashboards.", technologies: ["React", "TypeScript", "Supabase", "Tailwind"], liveUrl: "https://ahmedhelly.com", githubUrl: null, isVisible: true },
          { title: "BestyBoy Gaming", description: "Esports community platform with team profiles, match tracking, and news feed.", technologies: ["React", "Node.js", "MongoDB"], liveUrl: "https://bestyboy.gg", githubUrl: null, isVisible: true },
          { title: "Eco Eats", description: "Sustainable food discovery platform connecting eco-conscious consumers with local vendors.", technologies: ["React", "Django", "PostgreSQL"], liveUrl: null, githubUrl: "https://github.com/Bemora/eco-eats", isVisible: true },
          { title: "BMO Tools", description: "Developer productivity toolkit with calculators, converters, and API testing utilities.", technologies: ["React", "TypeScript", "Vite"], liveUrl: null, githubUrl: "https://github.com/Bemora/bmo-tools", isVisible: true },
        ];
        for (const p of defaultProjects) await storage.createProject(p as any);
      }
      res.json({ message: "Seed complete" });
    } catch (e: any) { res.status(500).json({ message: e.message || "Seed failed" }); }
  });

  const httpServer = createServer(app);
  return httpServer;
}
