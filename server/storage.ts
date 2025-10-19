import {
  users,
  certificates,
  reviews,
  contactMessages,
  projects,
  notifications,
  analytics,
  type User,
  type UpsertUser,
  type Certificate,
  type InsertCertificate,
  type Review,
  type InsertReview,
  type ContactMessage,
  type InsertContactMessage,
  type Project,
  type InsertProject,
  type Notification,
  type InsertNotification,
  type Analytics,
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, count, gte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Certificate operations
  getCertificates(): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  deleteCertificate(id: number): Promise<void>;
  
  // Review operations
  getApprovedReviews(): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<void>;
  deleteReview(id: number): Promise<void>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markMessageAsRead(id: number): Promise<void>;
  
  // Project operations
  getVisibleProjects(): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Notification operations
  getActiveNotifications(): Promise<Notification[]>;
  getAllNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification>;
  deleteNotification(id: number): Promise<void>;
  
  // Analytics operations
  createAnalyticsEvent(event: InsertAnalytics): Promise<Analytics>;
  getAnalytics(days?: number): Promise<Analytics[]>;
  getAnalyticsSummary(): Promise<{
    totalViews: number;
    totalProjects: number;
    totalReviews: number;
    totalContacts: number;
    recentActivity: Analytics[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: userData,
      })
      .returning();
    return user;
  }

  // Certificate operations
  async getCertificates(): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.isVisible, true))
      .orderBy(desc(certificates.createdAt));
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const [newCertificate] = await db
      .insert(certificates)
      .values(certificate)
      .returning();
    return newCertificate;
  }

  async deleteCertificate(id: number): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  // Review operations
  async getApprovedReviews(): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.isApproved, true))
      .orderBy(desc(reviews.createdAt));
  }

  async approveReview(id: number): Promise<void> {
    await db
      .update(reviews)
      .set({ isApproved: true } as any)
      .where(eq(reviews.id, id));
  }

  async deleteReview(id: number): Promise<void> {
    await db
      .delete(reviews)
      .where(eq(reviews.id, id));
  }

  async getAllReviews(): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db
      .update(contactMessages)
      .set({ isRead: true } as any)
      .where(eq(contactMessages.id, id));
  }

  // Project operations
  async getVisibleProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.isVisible, true))
      .orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Notification operations
  async getActiveNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.isActive, true))
      .orderBy(desc(notifications.createdAt));
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification> {
    const [updatedNotification] = await db
      .update(notifications)
      .set(notification)
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  // Analytics operations
  async createAnalyticsEvent(event: InsertAnalytics): Promise<Analytics> {
    const [newEvent] = await db
      .insert(analytics)
      .values(event)
      .returning();
    return newEvent;
  }

  async getAnalytics(days: number = 30): Promise<Analytics[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await db
      .select()
      .from(analytics)
      .where(gte(analytics.createdAt, cutoffDate))
      .orderBy(desc(analytics.createdAt))
      .limit(1000);
  }

  async getAnalyticsSummary() {
    const [viewsResult] = await db
      .select({ count: count() })
      .from(analytics)
      .where(eq(analytics.eventType, 'page_view'));

    const [projectsResult] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.isVisible, true));

    const [reviewsResult] = await db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.isApproved, true));

    const [contactsResult] = await db
      .select({ count: count() })
      .from(contactMessages);

    const recentActivity = await db
      .select()
      .from(analytics)
      .orderBy(desc(analytics.createdAt))
      .limit(10);

    return {
      totalViews: viewsResult?.count || 0,
      totalProjects: projectsResult?.count || 0,
      totalReviews: reviewsResult?.count || 0,
      totalContacts: contactsResult?.count || 0,
      recentActivity,
    };
  }
}

export const storage = new DatabaseStorage();
