import type { Env } from "../../config"
import {
  S3CompatibleStorageProvider,
  settingsFromEnv,
} from "./s3-compatible"

export class MinioStorageProvider extends S3CompatibleStorageProvider {
  constructor(env: Env) {
    super("minio", settingsFromEnv("minio", env))
  }
}
