import type { Env } from "../config"
import type { StorageProvider } from "./storage.interface"
import { MinioStorageProvider } from "./providers/minio.provider"
import { R2StorageProvider } from "./providers/r2.provider"
import { S3StorageProvider } from "./providers/s3.provider"
import { SupabaseStorageProvider } from "./providers/supabase.provider"

export function createStorageProvider(env: Env): StorageProvider {
  switch (env.STORAGE_PROVIDER) {
    case "minio":
      return new MinioStorageProvider(env)
    case "s3":
      return new S3StorageProvider(env)
    case "r2":
      return new R2StorageProvider(env)
    case "supabase":
      return new SupabaseStorageProvider(env)
  }
}

export type { StorageProvider } from "./storage.interface"
