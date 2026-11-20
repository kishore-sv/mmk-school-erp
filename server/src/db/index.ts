import { SQL } from "bun"
import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/bun-sql"

import { env } from "../config"
import * as schema from "./schema"
import { log } from "../utils/logger"

function openDatabase() {
  return drizzle(new SQL(env.POSTGRES_URL), { schema })
}

export type Database = ReturnType<typeof openDatabase>

let database: ReturnType<typeof openDatabase> | null = null

export function getDb() {
  if (!database) {
    database = openDatabase()
  }
  return database
}

export function resetDbForTests(): void {
  database = null
}

export async function checkDatabase(): Promise<boolean> {
  try {
    await getDb().execute(sql`select 1`)
    return true
  } catch (error) {
    log("warn", "database health check failed", {
      error: error instanceof Error ? error.name : "unknown",
    })
    return false
  }
}
