import "dotenv/config"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema"

// Serverless-friendly pool: keep connections tiny so the Supabase pooler isn't
// exhausted (EMAXCONNSESSION) across many Vercel function instances.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 1,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
})

export const db = drizzle(pool, { schema })
