# PhotoArchive

Self-hosted photo archive for organizations built as a Bun monorepo.

## Structure

- `backend/` - Hono API, Prisma ORM, filesystem storage pipeline.
- `frontend/` - Next.js App Router public site and admin panel shell.
- `storage/` - local file storage root from `.env`.
- `logs/` - audit log JSONL files.

## Backend modules

- `auth`
- `users`
- `albums`
- `photos`
- `articles`
- `categories`
- `storage`
- `audit-log`
- `common`

## Quick start

1. Copy `.env.example` to `.env`.
2. Install dependencies: `bun install`.
3. Start PostgreSQL on `localhost:5433`: `docker compose up -d`.
4. Generate Prisma client: `bun run db:generate`.
5. Apply migrations: `bun run db:migrate`.
6. Create or update the root account: `bun run db:seed`.
7. Start both apps from the repository root: `bun run dev`.

## Local URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`
- Health check: `http://localhost:4000/health`

## Useful commands

- Backend only: `bun run dev:backend`
- Frontend only: `bun run dev:frontend`
- Backend tests: `cd backend && bun test`
- Backend typecheck/build: `cd backend && bun run check && bun run build`
- Frontend typecheck/build: `cd frontend && bun run check && bun run build`
- Seed root user: `bun run db:seed`

## Root and admin accounts

- Root seed values come from `.env`: `ROOT_USERNAME` and `ROOT_PASSWORD`.
- `ROOT_PASSWORD` must be at least 8 characters.
- Seed is idempotent: if root user already exists, role is forced to `root`, account is activated, and password hash is refreshed from `.env`.
- Create admin accounts via API (root only): `POST /api/v1/users/admin`
- In frontend UI, root can create admins at `/admin/users`.

Example request:

```bash
curl -X POST http://localhost:4000/api/v1/users/admin \
	-H 'content-type: application/json' \
	-H 'authorization: Bearer <root-jwt>' \
	-H 'x-csrf-token: <csrf-token>' \
	-H 'cookie: pa_csrf=<csrf-token>' \
	-d '{"username":"archive-admin","password":"StrongPass123"}'
```

## Notes

- The default database URL uses the Docker PostgreSQL container on port `5433`.
- In this environment `bun run prisma:generate` can be flaky under Bun 1.3.x. If the Prisma client is already generated and backend tests/build pass, the app can still run normally.
