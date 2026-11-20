import type { Env } from "../../config"
import {
  S3CompatibleStorageProvider,
  settingsFromEnv,
} from "./s3-compatible"

export class R2StorageProvider extends S3CompatibleStorageProvider {
  constructor(env: Env) {
    super("r2", settingsFromEnv("r2", env))
  }
}
