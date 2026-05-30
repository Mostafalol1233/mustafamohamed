import {
  users,
  certificates,
  reviews,
  contactMessages,
  projects,
  notifications,
  analytics,
  testimonials,
  skills,
  siteSettings,
  clients,
  blogPosts,
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
  type Testimonial,
  type InsertTestimonial,
  type Skill,
  type InsertSkill,
  type SiteSetting,
  type InsertSiteSetting,
  type Client,
  type InsertClient,
  type BlogPost,
  type InsertBlogPost,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getCertificates(): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, data: Partial<InsertCertificate>): Promise<Certificate>;
  deleteCertificate(id: number): Promise<void>;

  getApprovedReviews(): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<void>;
  deleteReview(id: number): Promise<void>;

  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markMessageAsRead(id: number): Promise<void>;
  deleteContactMessage(id: number): Promise<void>;

  getVisibleProjects(): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  getActiveNotifications(): Promise<Notification[]>;
  getAllNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification>;
  deleteNotification(id: number): Promise<void>;

  createAnalyticsEvent(event: InsertAnalytics): Promise<Analytics>;
  getAnalytics(days?: number): Promise<Analytics[]>;
  getAnalyticsSummary(): Promise<{
    totalViews: number;
    totalProjects: number;
    totalReviews: number;
    totalContacts: number;
    recentActivity: Analytics[];
  }>;

  getVisibleTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  getAllSkills(): Promise<Skill[]>;
  updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill>;

  getAllSiteSettings(): Promise<SiteSetting[]>;
  upsertSiteSetting(key: string, value: string): Promise<SiteSetting>;

  getVisibleClients(): Promise<Client[]>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, data: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({ target: users.id, set: userData })
      .returning();
    return user;
  }

  async getCertificates(): Promise<Certificate[]> {
    return db.select().from(certificates).where(eq(certificates.isVisible, true)).orderBy(desc(certificates.createdAt));
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const [r] = await db.insert(certificates).values(certificate).returning();
    return r;
  }

  async updateCertificate(id: number, data: Partial<InsertCertificate>): Promise<Certificate> {
    const [r] = await db.update(certificates).set(data).where(eq(certificates.id, id)).returning();
    return r;
  }

  async deleteCertificate(id: number): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  async getApprovedReviews(): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
  }

  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [r] = await db.insert(reviews).values(review).returning();
    return r;
  }

  async approveReview(id: number): Promise<void> {
    await db.update(reviews).set({ isApproved: true } as any).where(eq(reviews.id, id));
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [r] = await db.insert(contactMessages).values(message).returning();
    return r;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true } as any).where(eq(contactMessages.id, id));
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async getVisibleProjects(): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.isVisible, true)).orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [r] = await db.insert(projects).values(project).returning();
    return r;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [r] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return r;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getActiveNotifications(): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.isActive, true)).orderBy(desc(notifications.createdAt));
  }

  async getAllNotifications(): Promise<Notification[]> {
    return db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [r] = await db.insert(notifications).values(notification).returning();
    return r;
  }

  async updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification> {
    const [r] = await db.update(notifications).set(notification).where(eq(notifications.id, id)).returning();
    return r;
  }

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  async createAnalyticsEvent(event: InsertAnalytics): Promise<Analytics> {
    const [r] = await db.insert(analytics).values(event).returning();
    return r;
  }

  async getAnalytics(days: number = 30): Promise<Analytics[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return db.select().from(analytics).where(gte(analytics.createdAt, cutoffDate)).orderBy(desc(analytics.createdAt)).limit(1000);
  }

  async getAnalyticsSummary() {
    const [viewsResult] = await db.select({ count: count() }).from(analytics).where(eq(analytics.eventType, "page_view"));
    const [projectsResult] = await db.select({ count: count() }).from(projects).where(eq(projects.isVisible, true));
    const [reviewsResult] = await db.select({ count: count() }).from(reviews).where(eq(reviews.isApproved, true));
    const [contactsResult] = await db.select({ count: count() }).from(contactMessages);
    const recentActivity = await db.select().from(analytics).orderBy(desc(analytics.createdAt)).limit(10);
    return {
      totalViews: viewsResult?.count || 0,
      totalProjects: projectsResult?.count || 0,
      totalReviews: reviewsResult?.count || 0,
      totalContacts: contactsResult?.count || 0,
      recentActivity,
    };
  }

  async getVisibleTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials).where(eq(testimonials.visible, true)).orderBy(desc(testimonials.createdAt));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [r] = await db.insert(testimonials).values(testimonial).returning();
    return r;
  }

  async updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [r] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    return r;
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async getAllSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(skills.sortOrder);
  }

  async updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill> {
    const [r] = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
    return r;
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings).orderBy(siteSettings.key);
  }

  async upsertSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const [r] = await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } })
      .returning();
    return r;
  }

  async getVisibleClients(): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.isVisible, true)).orderBy(clients.sortOrder, desc(clients.createdAt));
  }

  async getAllClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(clients.sortOrder, desc(clients.createdAt));
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [r] = await db.insert(clients).values(client).returning();
    return r;
  }

  async updateClient(id: number, data: Partial<InsertClient>): Promise<Client> {
    const [r] = await db.update(clients).set(data).where(eq(clients.id, id)).returning();
    return r;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [r] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return r;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [r] = await db.insert(blogPosts).values(post).returning();
    return r;
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [r] = await db.update(blogPosts).set(data).where(eq(blogPosts.id, id)).returning();
    return r;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
