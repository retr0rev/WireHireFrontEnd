# WireHire Frontend

Monorepo with two standalone Vite + React apps serving the WireHire job board platform.

## Stack

- **React 19** + TypeScript
- **Vite 6** + TanStack Router + TanStack Query
- **Tailwind CSS v4** (no config file, `@import "tailwindcss"`)
- **pnpm workspaces** monorepo

## Apps

| App | Port | Dev URL | Type |
|---|---|---|---|
| `@wirehire/public` | 5173 | public.wirehire.com | Public job board |
| `@wirehire/dashboard` | 5174 | employer.wirehire.com | Unified employer + admin dashboard (RBAC) |
| `@wirehire/shared` | — | — | Shared types, hooks, API client |

## Quick Start

```bash
pnpm install

# Start all frontends
pnpm dev:public
pnpm dev:dashboard

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
  auth/           — UnifiedAuthProvider (role-aware cookie-based auth)
  constants/      — Job categories

apps/public/       — Public job board (CSR)
apps/employer/     — Unified employer + admin dashboard with RBAC (CSR)
```

## Auth Flow

1. User logs in → backend sets httpOnly `token` cookie
2. Frontend calls `/api/auth/me` with `credentials: 'include'`
3. Cookie sent automatically on every API request
4. Auth provider checks on mount (probes both employer and admin endpoints in parallel) and on login/logout
5. AuthLayout guards redirect unauthenticated users to `/login`
6. Admin routes under `/admin/*` with role-based access control

No tokens are stored in JavaScript or localStorage.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | — | `http://localhost:8080` | Backend API URL |
| `VITE_EMPLOYER_URL` | — | `http://localhost:5174` | URL of the dashboard app (for cross-app login links) |

Set per-app in Vercel dashboard (or `.env` for local dev).

## Deployment (Vercel)

Create 2 separate Vercel projects from the same repo:

1. **Root Directory**: `apps/public` → public job board
2. **Root Directory**: `apps/employer` → unified dashboard (employer + admin)

Each `vercel.json` handles the monorepo install + build correctly.
