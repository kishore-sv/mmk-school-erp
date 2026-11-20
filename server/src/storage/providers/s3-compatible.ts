import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3"

import type { Env, StorageProviderName } from "../../config"
import type { StorageProvider } from "../storage.interface"
import { StorageNotImplementedError } from "../storage.types"
import type {
  MultipartPart,
  MultipartUpload,
  ObjectLocation,
  ObjectMetadata,
  PresignedRequest,
  StorageCapabilities,
  UploadConstraints,
} from "../storage.types"

const unverifiedCapabilities: StorageCapabilities = {
  multipart: "unverified",
  presignedUrls: "unverified",
  publicBucketsByDefault: false,
}

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
  readonly capabilities = unverifiedCapabilities
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

  async checkAvailability(): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }))
      return true
    } catch {
      return false
    }
  }

  uploadObject(
    _location: ObjectLocation,
    _body: Uint8Array,
    _constraints: UploadConstraints,
  ): Promise<ObjectMetadata> {
    return this.unimplemented("uploadObject")
  }

  downloadObject(_location: ObjectLocation): Promise<Uint8Array> {
    return this.unimplemented("downloadObject")
  }

  deleteObject(_location: ObjectLocation): Promise<void> {
    return this.unimplemented("deleteObject")
  }

  getObjectMetadata(_location: ObjectLocation): Promise<ObjectMetadata> {
    return this.unimplemented("getObjectMetadata")
  }

  objectExists(_location: ObjectLocation): Promise<boolean> {
    return this.unimplemented("objectExists")
  }

  createPresignedUploadUrl(
    _location: ObjectLocation,
    _constraints: UploadConstraints,
  ): Promise<PresignedRequest> {
    return this.unimplemented("createPresignedUploadUrl")
  }

  createPresignedDownloadUrl(
    _location: ObjectLocation,
  ): Promise<PresignedRequest> {
    return this.unimplemented("createPresignedDownloadUrl")
  }

  createMultipartUpload(
    _location: ObjectLocation,
    _constraints: UploadConstraints,
  ): Promise<MultipartUpload> {
    return this.unimplemented("createMultipartUpload")
  }

  createMultipartPartUrl(
    _upload: MultipartUpload,
    _partNumber: number,
  ): Promise<PresignedRequest> {
    return this.unimplemented("createMultipartPartUrl")
  }

  completeMultipartUpload(
    _upload: MultipartUpload,
    _parts: MultipartPart[],
  ): Promise<ObjectMetadata> {
    return this.unimplemented("completeMultipartUpload")
  }

  abortMultipartUpload(_upload: MultipartUpload): Promise<void> {
    return this.unimplemented("abortMultipartUpload")
  }

  private unimplemented(operation: string): Promise<never> {
    return Promise.reject(new StorageNotImplementedError(this.name, operation))
  }
}
