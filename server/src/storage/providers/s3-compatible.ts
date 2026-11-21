import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import type { Env, StorageProviderName } from "../../config"
import type { StorageProvider } from "../storage.interface"
import type {
  MultipartPart,
  MultipartUpload,
  ObjectLocation,
  ObjectMetadata,
  PresignedRequest,
  StorageCapabilities,
  UploadConstraints,
} from "../storage.types"

const verifiedCapabilities: StorageCapabilities = {
  multipart: "verified",
  presignedUrls: "verified",
  publicBucketsByDefault: false,
}

const PRESIGN_SECONDS = 900

export interface S3CompatibleSettings {
  provider: StorageProviderName
  region: string
  endpoint: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  forcePathStyle: boolean
}

export function settingsFromEnv(
  provider: StorageProviderName,
  env: Env,
): S3CompatibleSettings {
  return {
    provider,
    region: env.STORAGE_REGION,
    endpoint: env.STORAGE_ENDPOINT,
    bucket: env.STORAGE_BUCKET,
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
    forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
  }
}

export abstract class S3CompatibleStorageProvider implements StorageProvider {
  readonly capabilities = verifiedCapabilities
  protected readonly client: S3Client
  protected readonly bucket: string

  constructor(
    readonly name: StorageProviderName,
    settings: S3CompatibleSettings,
  ) {
    this.bucket = settings.bucket
    this.client = new S3Client({
      region: settings.region,
      endpoint: settings.endpoint.length > 0 ? settings.endpoint : undefined,
      forcePathStyle: settings.forcePathStyle,
      credentials: {
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey,
      },
    })
  }

  async configureDevCors(): Promise<void> {
    await this.client.send(
      new PutBucketCorsCommand({
        Bucket: this.bucket,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: ["*"],
              AllowedMethods: ["GET", "PUT", "POST", "HEAD", "DELETE"],
              AllowedHeaders: ["*"],
              ExposeHeaders: ["ETag"],
            },
          ],
        },
      }),
    )
  }

  async checkAvailability(): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }))
      return true
    } catch {
      return false
    }
  }

  private assertKey(key: string): void {
    if (!key || key.startsWith("/") || key.includes("..") || key.includes("\\") || key.includes("\0")) {
      throw new Error("INVALID_OBJECT_KEY")
    }
  }

  private location(key: string): ObjectLocation {
    this.assertKey(key)
    return { bucket: this.bucket, key }
  }

  async uploadObject(
    location: ObjectLocation,
    body: Uint8Array,
    constraints: UploadConstraints,
  ): Promise<ObjectMetadata> {
    this.assertKey(location.key)
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: location.key,
        Body: body,
        ContentType: constraints.contentType,
        ContentLength: body.byteLength,
      }),
    )
    return this.getObjectMetadata(location)
  }

  async downloadObject(location: ObjectLocation): Promise<Uint8Array> {
    this.assertKey(location.key)
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: location.key, Range: "bytes=0-31" }),
    )
    const bytes = await response.Body?.transformToByteArray()
    return bytes ? new Uint8Array(bytes) : new Uint8Array()
  }

  async deleteObject(location: ObjectLocation): Promise<void> {
    this.assertKey(location.key)
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: location.key }))
  }

  async getObjectMetadata(location: ObjectLocation): Promise<ObjectMetadata> {
    this.assertKey(location.key)
    const head = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: location.key }))
    return {
      bucket: this.bucket,
      key: location.key,
      size: head.ContentLength ?? null,
      contentType: head.ContentType ?? null,
      eTag: head.ETag ?? null,
    }
  }

  async objectExists(location: ObjectLocation): Promise<boolean> {
    try {
      await this.getObjectMetadata(location)
      return true
    } catch {
      return false
    }
  }

  async createPresignedUploadUrl(
    location: ObjectLocation,
    constraints: UploadConstraints,
  ): Promise<PresignedRequest> {
    this.assertKey(location.key)
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: location.key,
      ContentType: constraints.contentType,
      ContentLength: constraints.contentLength,
    })
    const url = await getSignedUrl(this.client, command, { expiresIn: PRESIGN_SECONDS })
    return {
      url,
      method: "PUT",
      expiresAt: new Date(Date.now() + PRESIGN_SECONDS * 1000).toISOString(),
      headers: { "content-type": constraints.contentType },
    }
  }

  async createPresignedDownloadUrl(location: ObjectLocation): Promise<PresignedRequest> {
    this.assertKey(location.key)
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: location.key })
    const url = await getSignedUrl(this.client, command, { expiresIn: PRESIGN_SECONDS })
    return {
      url,
      method: "GET",
      expiresAt: new Date(Date.now() + PRESIGN_SECONDS * 1000).toISOString(),
    }
  }

  async createMultipartUpload(
    location: ObjectLocation,
    constraints: UploadConstraints,
  ): Promise<MultipartUpload> {
    this.assertKey(location.key)
    const created = await this.client.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucket,
        Key: location.key,
        ContentType: constraints.contentType,
      }),
    )
    if (!created.UploadId) {
      throw new Error("MULTIPART_CREATE_FAILED")
    }
    return { bucket: this.bucket, key: location.key, uploadId: created.UploadId }
  }

  async createMultipartPartUrl(upload: MultipartUpload, partNumber: number): Promise<PresignedRequest> {
    this.assertKey(upload.key)
    if (upload.bucket !== this.bucket) {
      throw new Error("INVALID_OBJECT_KEY")
    }
    const command = new UploadPartCommand({
      Bucket: this.bucket,
      Key: upload.key,
      UploadId: upload.uploadId,
      PartNumber: partNumber,
    })
    const url = await getSignedUrl(this.client, command, { expiresIn: PRESIGN_SECONDS })
    return {
      url,
      method: "PUT",
      expiresAt: new Date(Date.now() + PRESIGN_SECONDS * 1000).toISOString(),
    }
  }

  async completeMultipartUpload(upload: MultipartUpload, parts: MultipartPart[]): Promise<ObjectMetadata> {
    this.assertKey(upload.key)
    await this.client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key: upload.key,
        UploadId: upload.uploadId,
        MultipartUpload: {
          Parts: parts.map((part) => ({ ETag: part.eTag, PartNumber: part.partNumber })),
        },
      }),
    )
    return this.getObjectMetadata(this.location(upload.key))
  }

  async abortMultipartUpload(upload: MultipartUpload): Promise<void> {
    this.assertKey(upload.key)
    await this.client.send(
      new AbortMultipartUploadCommand({
        Bucket: this.bucket,
        Key: upload.key,
        UploadId: upload.uploadId,
      }),
    )
  }
}
