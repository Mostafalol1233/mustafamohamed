import {
  pgTable,
  text,
  varchar,
  timestamp,
  timestamptz,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  issueDate: text("issue_date"),
  imageUrl: text("image_url"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  technologies: text("technologies").array(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  stars: integer("stars").notNull().default(5),
  icon: text("icon"),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  percent: integer("percent").notNull().default(80),
  description: text("description"),
  icon: text("icon"),
  tags: text("tags").array(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  color: text("color").notNull().default("#4f9eff"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image"),
  tags: text("tags").array(),
  author: text("author").notNull().default("Mustafa Mohamed"),
  isPublished: boolean("is_published").default(true),
  readTime: integer("read_time").default(5),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCertificate = typeof certificates.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;

export type InsertReview = typeof reviews.$inferInsert;
export type Review = typeof reviews.$inferSelect;

export type InsertContactMessage = typeof contactMessages.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;

export type InsertAnalytics = typeof analytics.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;

export type InsertTestimonial = typeof testimonials.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertSkill = typeof skills.$inferInsert;
export type Skill = typeof skills.$inferSelect;

export type InsertSiteSetting = typeof siteSettings.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;

export const insertCertificateSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  issueDate: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isVisible: z.boolean().optional(),
});

export const insertReviewSchema = z.object({
  name: z.string(),
  email: z.string().optional().nullable(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
});

export const insertContactMessageSchema = z.object({
  name: z.string(),
  email: z.string(),
  subject: z.string().optional().nullable(),
  message: z.string(),
});

export const insertProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional(),
  liveUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  isVisible: z.boolean().optional(),
});

export const insertNotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.enum(["info", "warning", "success", "error"]).optional(),
  isActive: z.boolean().optional(),
});

export const insertAnalyticsSchema = z.object({
  eventType: z.string(),
  eventData: z.any().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const insertTestimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string(),
  quote: z.string(),
  stars: z.number().min(1).max(5).optional(),
  icon: z.string().optional().nullable(),
  visible: z.boolean().optional(),
});

export const insertSkillSchema = z.object({
  category: z.string(),
  name: z.string(),
  percent: z.number().min(0).max(100),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  sortOrder: z.number().optional(),
});

export const insertSiteSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type InsertClient = typeof clients.$inferInsert;
export type Client = typeof clients.$inferSelect;

export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;

export const insertClientSchema = z.object({
  name: z.string(),
  initials: z.string(),
  color: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
  isVisible: z.boolean().optional(),
});

export const insertBlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  author: z.string().optional(),
  isPublished: z.boolean().optional(),
  readTime: z.number().optional(),
});
