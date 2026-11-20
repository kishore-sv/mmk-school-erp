import type { Env } from "../../config"
import {
  S3CompatibleStorageProvider,
  settingsFromEnv,
} from "./s3-compatible"

export class SupabaseStorageProvider extends S3CompatibleStorageProvider {
  constructor(env: Env) {
    super("supabase", settingsFromEnv("supabase", env))
  }
}
