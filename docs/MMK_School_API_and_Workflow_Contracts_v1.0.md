# MMK School - API & Workflow Contracts v1.0

## 1. API conventions

- Base path: `/api/v1`.
- JSON payloads; dates `YYYY-MM-DD`; timestamps ISO 8601 with timezone.
- Browser sessions use secure HttpOnly/SameSite cookies where appropriate.
- Mobile auth uses vetted short-lived credentials and refresh/session rotation.
- Tenant context derives from verified membership, never from untrusted request body.
- Server-side schema validation; stable error codes and `request_id`.
- Idempotency keys for admissions conversion and retry-sensitive financial operations.
- Server-side pagination/filtering/sorting with allowlisted fields.

## 2. Standard envelopes

Success:
```json
{ "data": { "id": "uuid", "status": "active" }, "meta": { "request_id": "req_..." } }
```

Validation error:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "field_errors": { "start_date": "Must be before end date." },
    "request_id": "req_..."
  }
}
```

## 3. Endpoint catalogue

### Authentication
- `POST /auth/login`
- `POST /auth/mfa/challenge`
- `POST /auth/mfa/verify`
- `POST /auth/logout`
- `POST /auth/recovery/start`
- `POST /auth/recovery/complete`
- `GET /auth/sessions`
- `DELETE /auth/sessions/{sessionId}` revokes a session; it is not deletion of a business record.

### School and academic configuration
- `GET/PATCH /school/profile`
- `PATCH /school/branding`
- `GET/POST /academic-years`
- `GET/PATCH /academic-years/{id}`
- `POST /academic-years/{id}/activate`
- `POST /academic-years/{id}/archive`
- `GET/POST /grades`
- `GET/PATCH /grades/{id}`
- `GET/POST /grades/{id}/sections`
- `GET/POST /subjects`
- `POST /grade-subject-allocations`

### People and enrollment
- `GET/POST /students`
- `GET/PATCH /students/{id}`
- `POST /students/{id}/archive`
- `POST /students/{id}/enrollments`
- `POST /students/{id}/promotions:preview`
- `POST /students/{id}/promotions:commit`
- `GET/POST /parents`
- `POST /students/{id}/guardian-relationships`
- `POST /guardian-relationships/{id}/verify`
- `POST /guardian-relationships/{id}/revoke`
- `GET/POST /staff`
- `POST /staff/{id}/archive`

### Admissions
- `POST /public/admission-enquiries`
- `POST /public/admission-applications`
- `GET /public/admission-applications/{reference}/status`
- `GET /admission-applications`
- `POST /admission-applications/{id}/reviews`
- `POST /admission-applications/{id}/decisions`
- `POST /admission-applications/{id}/convert`

### Timetable and attendance
- `POST /timetable-drafts`
- `PUT /timetable-drafts/{id}/entries`
- `POST /timetable-drafts/{id}/validate`
- `POST /timetable-drafts/{id}/publish`
- `GET /teachers/{id}/timetable`
- `POST /attendance-sessions`
- `POST /attendance-sessions/{id}/records:bulk`
- `POST /attendance-corrections`
- `POST /attendance-corrections/{id}/decision`

### Examinations and fees
- `POST /examinations`
- `POST /examinations/{id}/marks:bulk`
- `POST /examinations/{id}/verify`
- `POST /examinations/{id}/publish`
- `POST /fee-assignments`
- `POST /payments`
- `POST /payments/{id}/allocations`
- `POST /refunds`
- `GET /fee-ledger`

### Files, notifications and audit
- `POST /files/upload-intents`
- `POST /files/{id}/complete`
- `GET /files/{id}/download-url`
- `POST /announcements`
- `POST /notifications`
- `GET /audit-events`

## 4. Workflow contracts

### Admission conversion
Approved application + `admission.convert` permission + idempotency key. In one transaction create student, initial enrollment and verified guardian links. Mark application converted and store resulting IDs. Retrying with same key returns same result.

### Student promotion
Preview source enrollments, validate destination year and grade/section mapping, classify repeat/withdrawn/graduated exceptions, commit new enrollment rows and preserve old enrollment.

### Timetable publication
Draft → validate teacher/section/room conflicts → resolve → preview impact → publish immutable version → notify after commit. Later edits create another version.

### Attendance correction
Request with reason → validate edit window → authorized reviewer decision → immutable correction event → update current attendance projection → notify.

### Marks publication
Teacher entry → validation → verifier review → authorized publication snapshot → student/parent visibility. Post-publication edits require correction/version flow.

### Fee payment
Create fee assignment/invoice → record payment with amount, method, date and reference → verify if required → allocate → issue receipt. Refund is a separate approved transaction.

### Archive/restore
Dependency check → impact preview → reason where required → confirmation for consequential action → archive metadata and audit event. Restore validates permissions, dependencies and uniqueness.

### Guardian relationship
Identify/invite → verify guardian → create relationship and access scopes → notify → audit. Revocation ends access without deleting either profile.

## 5. Error codes

`UNAUTHENTICATED`, `MFA_REQUIRED`, `FORBIDDEN`, `TENANT_SCOPE_INVALID`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `DUPLICATE_RECORD`, `INVALID_STATE_TRANSITION`, `DEPENDENCY_EXISTS`, `ARCHIVE_NOT_ALLOWED`, `RESTORE_CONFLICT`, `IDEMPOTENCY_KEY_REUSED`, `RATE_LIMITED`, `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `PROVIDER_DELIVERY_FAILED`, `INTERNAL_ERROR`.

## 6. API security checklist

- Verify tenant membership on every request.
- Check object-level authorization after tenant scope.
- Validate schema and allowlisted fields.
- CSRF protection for cookie-authenticated mutations.
- Rate-limit login, MFA, public forms and status tracking.
- Verify webhook signatures and replay windows.
- Never expose storage keys or permanent private URLs.
- Redact sensitive fields from logs/audit snapshots.
- Idempotency for retryable operations.
- Automated allowed/denied authorization tests.
