
import { db } from "./db.js";
import { certificates, reviews, contactMessages, projects } from "../shared/schema.js";

// Only import Replit Database in Replit environment
let replitDb: any = null;

if (process.env.REPLIT_DB_URL) {
  try {
    const Database = require("@replit/database");
    replitDb = new Database();
  } catch (error) {
    console.log("Replit Database not available - running outside Replit environment");
  }
}

export async function backupDatabase() {
  try {
    if (!replitDb) {
      console.log("⚠️ Backup not available - Replit Database not accessible");
      return false;
    }

    console.log("🔄 Starting database backup...");
    
    // Backup certificates
    const certificatesData = await db.select().from(certificates);
    await replitDb.set("backup_certificates", certificatesData);
    console.log(`✅ Backed up ${certificatesData.length} certificates`);
    
    // Backup reviews
    const reviewsData = await db.select().from(reviews);
    await replitDb.set("backup_reviews", reviewsData);
    console.log(`✅ Backed up ${reviewsData.length} reviews`);
    
    // Backup contact messages
    const contactData = await db.select().from(contactMessages);
    await replitDb.set("backup_contact_messages", contactData);
    console.log(`✅ Backed up ${contactData.length} contact messages`);
    
    // Backup projects
    const projectsData = await db.select().from(projects);
    await replitDb.set("backup_projects", projectsData);
    console.log(`✅ Backed up ${projectsData.length} projects`);
    
    // Save backup timestamp
    const timestamp = new Date().toISOString();
    await replitDb.set("backup_timestamp", timestamp);
    
    console.log(`🎉 Database backup completed successfully at ${timestamp}`);
    return true;
  } catch (error) {
    console.error("❌ Backup failed:", error);
    return false;
  }
}

export async function restoreDatabase() {
  try {
    if (!replitDb) {
      console.log("⚠️ Restore not available - Replit Database not accessible");
      return false;
    }

    console.log("🔄 Starting database restoration...");
    
    // Check if backup exists
    const backupTimestamp = await replitDb.get("backup_timestamp");
    if (!backupTimestamp) {
      console.log("❌ No backup found");
      return false;
    }
    
    console.log(`📅 Found backup from: ${backupTimestamp}`);
    
    // Restore certificates
    const certificatesBackup = await replitDb.get("backup_certificates");
    if (certificatesBackup && certificatesBackup.length > 0) {
      // Clear existing data
      await db.delete(certificates);
      // Insert backup data
      for (const cert of certificatesBackup) {
        const { id, createdAt, ...certData } = cert;
        await db.insert(certificates).values(certData);
      }
      console.log(`✅ Restored ${certificatesBackup.length} certificates`);
    }
    
    // Restore reviews
    const reviewsBackup = await replitDb.get("backup_reviews");
    if (reviewsBackup && reviewsBackup.length > 0) {
      await db.delete(reviews);
      for (const review of reviewsBackup) {
        const { id, createdAt, ...reviewData } = review;
        await db.insert(reviews).values(reviewData);
      }
      console.log(`✅ Restored ${reviewsBackup.length} reviews`);
    }
    
    // Restore contact messages
    const contactBackup = await replitDb.get("backup_contact_messages");
    if (contactBackup && contactBackup.length > 0) {
      await db.delete(contactMessages);
      for (const message of contactBackup) {
        const { id, createdAt, ...messageData } = message;
        await db.insert(contactMessages).values(messageData);
      }
      console.log(`✅ Restored ${contactBackup.length} contact messages`);
    }
    
    // Restore projects
    const projectsBackup = await replitDb.get("backup_projects");
    if (projectsBackup && projectsBackup.length > 0) {
      await db.delete(projects);
      for (const project of projectsBackup) {
        const { id, createdAt, ...projectData } = project;
        await db.insert(projects).values(projectData);
      }
      console.log(`✅ Restored ${projectsBackup.length} projects`);
    }
    
    console.log("🎉 Database restoration completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Restore failed:", error);
    return false;
  }
}

// Auto backup every 30 minutes
export function startAutoBackup() {
  if (!replitDb) {
    console.log("⚠️ Auto backup disabled - Replit Database not available");
    return;
  }
  
  console.log("🔄 Starting auto backup service...");
  
  // Initial backup
  backupDatabase();
  
  // Schedule regular backups every 30 minutes
  setInterval(() => {
    console.log("⏰ Running scheduled backup...");
    backupDatabase();
  }, 30 * 60 * 1000); // 30 minutes
}
