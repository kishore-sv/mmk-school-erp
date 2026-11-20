# Production architecture

This describes planned deployment boundaries. Nothing in this document is provisioned.

Local Docker Compose is a developer machine only. Its MinIO service is not the production storage service, and its default credentials are not production secrets.

## Planned production boundaries

| Concern | Planned service |
| --- | --- |
| PostgreSQL | AWS RDS |
| Object storage | AWS S3 first, with a later move to Cloudflare R2 through the same storage interface |
| Redis | A managed Redis-compatible service |
| HTTP API | The Express application in `server/`, deployed on its own |
| Background work | The application in `worker/`, deployed on its own |
| Web clients | `school-admin`, `portal`, `admission-portal`, and `websites/landing`, each deployed on its own |
| Mobile | The Expo application in `mobile/`, distributed through the relevant app stores |

Each web client, the API, and the worker stay independent deployables. There is no shared UI package.

Firebase Cloud Messaging is the planned mobile push provider. Environment placeholders exist for a project id, client email, and private key. No Firebase project is configured, and the worker does not send notifications.

Do not add Terraform, CloudFormation, or production credentials until a deployment task explicitly asks for them.
