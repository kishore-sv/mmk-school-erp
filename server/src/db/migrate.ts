import { migrate } from "drizzle-orm/bun-sql/migrator"

import { loadEnv } from "../config/env"
import { getDb } from "./index"

loadEnv()

await migrate(getDb(), { migrationsFolder: "./src/db/migrations" })
console.log("Migrations applied.")
