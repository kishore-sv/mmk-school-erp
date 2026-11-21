export class StorageNotImplementedError extends Error {
  readonly operation: string
  readonly provider: string

  constructor(provider: string, operation: string) {
    super(
      `${provider} storage operation "${operation}" is not implemented. Provider compatibility has not been verified.`,
    )
    this.name = "StorageNotImplementedError"
    this.provider = provider
    this.operation = operation
  }
}

export type StorageProviderName = "minio" | "s3" | "r2" | "supabase"

export interface ObjectLocation {
  bucket: string
  key: string
}

export interface ObjectMetadata {
  bucket: string
  key: string
  size: number | null
  contentType: string | null
  eTag: string | null
}

export interface PresignedRequest {
  url: string
  method: "PUT" | "GET"
  expiresAt: string
  headers?: Record<string, string>
}

export interface MultipartUpload {
  bucket: string
  key: string
  uploadId: string
}

export interface MultipartPart {
  partNumber: number
  eTag: string
}

export interface UploadConstraints {
  contentType: string
  contentLength: number
}

/**
 * Capability flags stay "unverified" until multipart and presigned URL
 * behavior is tested against each provider. S3 compatibility is not treated
 * as proof that every operation works the same way.
 */
export interface StorageCapabilities {
  multipart: "verified" | "unverified"
  presignedUrls: "verified" | "unverified"
  publicBucketsByDefault: boolean
}
