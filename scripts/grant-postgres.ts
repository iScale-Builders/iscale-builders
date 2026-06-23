import "dotenv/config"

import { Pool } from "pg"

// Run as the iscale_app role (the local direct DATABASE_URL) which OWNS the
// public tables created via db:push. Grants the `postgres` role (used by Vercel
// via the pooler) full access so the deployed app can read AND write.
const pool = new Pool({ connectionString: process.env.DATABASE_URL! })

const stmts = [
  "GRANT USAGE ON SCHEMA public TO postgres",
  "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres",
  "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres",
  "ALTER DEFAULT PRIVILEGES FOR ROLE iscale_app IN SCHEMA public GRANT ALL ON TABLES TO postgres",
  "ALTER DEFAULT PRIVILEGES FOR ROLE iscale_app IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres",
]

for (const s of stmts) {
  try {
    await pool.query(s)
    console.log("ok:", s)
  } catch (e) {
    console.error("FAIL:", s, "->", (e as Error).message)
  }
}
await pool.end()
console.log("done")
