import { loadEnv, type Env } from "./env"

export const env: Env = loadEnv()

export { loadEnv }
export type { Env, StorageProviderName } from "./env"
