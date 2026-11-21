# Branding and uploads

School logos and banners use the existing S3-compatible storage provider. The browser uploads with a short-lived pre-signed URL. The API chooses the object key:

`tenants/{tenantId}/schools/{schoolId}/branding/{logo|banner}/{id}.{ext}`

Allowed types are PNG, JPEG, and WebP. SVG is rejected. Logos are limited to 2 MB and banners to 8 MB. Files at or above 5 MB use multipart upload: create, sign each part, complete, or abort. Abandoned multipart uploads past their expiry are marked aborted.

Completion checks object size and the file signature. The previous object is deleted only when its key belongs to the same tenant. Branding reads use a short-lived download URL.

Platform Admin can upload during school creation and replace or remove images on the school page. School Admin can do the same for its own school from School Setup → School profile. Both actions are audited. The audit record stores object keys, not file bytes.

School Admin can edit name, email, phone, website, address, city, state, postal code, and description. School code, country, school type, board, timezone, language, and subscription fields stay with Platform Admin.
