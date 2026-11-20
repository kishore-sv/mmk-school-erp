import type { Env } from "../../config"
import {
  S3CompatibleStorageProvider,
  settingsFromEnv,
} from "./s3-compatible"

export class S3StorageProvider extends S3CompatibleStorageProvider {
  constructor(env: Env) {
    super("s3", {
      ...settingsFromEnv("s3", env),
      forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
    })
  }
}
