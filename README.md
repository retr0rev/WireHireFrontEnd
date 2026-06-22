# WireHire Frontend

Monorepo with three standalone Vite + React apps serving the WireHire job board platform.

## Stack

- **React 19** + TypeScript
- **Vite 6** + TanStack Router + TanStack Query
- **Tailwind CSS v4** (no config file, `@import "tailwindcss"`)
- **pnpm workspaces** monorepo

## Apps

| App | Port | Dev URL | Type |
|---|---|---|---|
| `@wirehire/public` | 5173 | public.wirehire.com | Public job board |
| `@wirehire/employer` | 5174 | employer.wirehire.com | Employer dashboard |
| `@wirehire/admin` | 5175 | admin.wirehire.com | Admin moderation panel |
| `@wirehire/shared` | — | — | Shared types, hooks, API client |

## Quick Start

```bash
pnpm install

# Start all 3 frontends
pnpm --filter @wirehire/public dev
pnpm --filter @wirehire/employer dev
pnpm --filter @wirehire/admin dev

# Build all
pnpm -r build

# Typecheck all
pnpm -r typecheck
```

The apps expect a backend running at `http://localhost:8080` by default. Set `VITE_API_URL` to override.

## Project Structure

```
packages/shared/src/
  types/          — JobApp, Client, Admin, API request/response types
  api/            — apiFetch client (credentials: 'include'), endpoint paths
  hooks/          — TanStack Query hooks (usePublicJobs, useMyJobs, useAdminJobs, etc.)
  auth/           — EmployerAuthProvider, AdminAuthProvider (cookie-based auth)
  constants/      — Job categories

apps/public/       — Public job board (SSR)
apps/employer/     — Employer dashboard (CSR)
apps/admin/        — Admin dashboard (CSR)
```

## Auth Flow

1. User logs in → backend sets httpOnly `token` cookie
2. Frontend calls `/api/auth/me` with `credentials: 'include'`
3. Cookie sent automatically on every API request
4. Auth provider checks on mount and on login/logout
5. AuthLayout guards redirect unauthenticated users to `/login`

No tokens are stored in JavaScript or localStorage.

## Environment Variables

| Variable | Required | Default |
|---|---|---|
| `VITE_API_URL` | — | `http://localhost:8080` |

Set per-app in Vercel dashboard (or `.env` for local dev).

## Deployment (Vercel)

Create 3 separate Vercel projects from the same repo. For each:

1. **Root Directory**: `apps/public`, `apps/employer`, or `apps/admin`
2. **Build Command**: Auto-detected from `vercel.json`
3. **Environment Variable**: `VITE_API_URL` = your Railway backend URL

Each `vercel.json` handles the monorepo install + build correctly.
