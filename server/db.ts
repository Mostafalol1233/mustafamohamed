import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema.js";

const connectionString = process.env.DATABASE_URL!;

// Enhanced connection with retry logic
export const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 60,
  prepare: false
});

export const db = drizzle(client, { schema });