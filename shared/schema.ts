import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Certificates table
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  issueDate: text("issue_date"),
  imageUrl: text("image_url"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolio projects table
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

// Site notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, success, error
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
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

// Zod schemas
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
