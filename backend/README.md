# Backend - Storage configuration (updated on 2025-12-14)

This backend now supports two storage drivers for uploaded videos:

- `cloudinary` (might be deprecated): uses Cloudinary and the existing setup.
- `local` (default in future releases): stores uploaded files in the server filesystem under `UPLOADS_DIR` and serves them from `/uploads`.

Environment variables (add these to your `.env` or use `.env.example`):

- `STORAGE_DRIVER` - `cloudinary` or `local`
- `UPLOADS_DIR` - path to store uploaded files (default: `./uploads`)
- `SERVER_BASE_URL` - public base URL of the server used to build media URLs (e.g., `https://app.example.com`)

When `STORAGE_DRIVER=local`:

- Uploaded files are saved to `UPLOADS_DIR` and exposed under `/uploads/:filename`.
- ETags are computed from the file contents (sha256) to help detect duplicates.
- Use the migration script `backend/scripts/migrate-cloudinary-to-local.ts` to migrate existing Cloudinary-hosted videos.
