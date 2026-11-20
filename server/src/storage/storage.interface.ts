import type {
  MultipartPart,
  MultipartUpload,
  ObjectLocation,
  ObjectMetadata,
  PresignedRequest,
  StorageCapabilities,
  StorageProviderName,
  UploadConstraints,
} from "./storage.types"

export interface StorageProvider {
  readonly name: StorageProviderName
  readonly capabilities: StorageCapabilities
  checkAvailability(): Promise<boolean>
  uploadObject(
    location: ObjectLocation,
    body: Uint8Array,
    constraints: UploadConstraints,
  ): Promise<ObjectMetadata>
  downloadObject(location: ObjectLocation): Promise<Uint8Array>
  deleteObject(location: ObjectLocation): Promise<void>
  getObjectMetadata(location: ObjectLocation): Promise<ObjectMetadata>
  objectExists(location: ObjectLocation): Promise<boolean>
  createPresignedUploadUrl(
    location: ObjectLocation,
    constraints: UploadConstraints,
  ): Promise<PresignedRequest>
  createPresignedDownloadUrl(location: ObjectLocation): Promise<PresignedRequest>
  createMultipartUpload(
    location: ObjectLocation,
    constraints: UploadConstraints,
  ): Promise<MultipartUpload>
  createMultipartPartUrl(
    upload: MultipartUpload,
    partNumber: number,
  ): Promise<PresignedRequest>
  completeMultipartUpload(
    upload: MultipartUpload,
    parts: MultipartPart[],
  ): Promise<ObjectMetadata>
  abortMultipartUpload(upload: MultipartUpload): Promise<void>
}
