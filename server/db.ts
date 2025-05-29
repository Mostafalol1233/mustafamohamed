import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure pool for serverless environments
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Serverless-friendly settings
  max: 1, // Limit connections for serverless
  idleTimeoutMillis: 0, // Close connections immediately when not in use
  connectionTimeoutMillis: 0, // Don't wait for connections
};

export const pool = new Pool(poolConfig);
export const db = drizzle({ client: pool, schema });

// Graceful shutdown for serverless
process.on('SIGINT', () => pool.end());
process.on('SIGTERM', () => pool.end());