# WireHire — Full Implementation Plan

## Overview

Three standalone frontend apps + Go backend modifications for a job board platform.

| App | Stack | Subdomain | Purpose |
|-----|-------|-----------|---------|
| **App 1** | TanStack Start (SSR) | `public.wirehire.com` | Public job listings + employer signup |
| **App 2** | Vite + CSR + TanStack Router | `employer.wirehire.com` | Employer dashboard (CRUD jobs) |
| **App 3** | Vite + CSR + TanStack Router | `admin.wirehire.com` | Admin dashboard (moderate + manage) |
| **Backend** | Go + Chi + SQLite | `api.wirehire.com` | API server |

Monorepo root: `/home/retr0rev/jobfront2/` (pnpm workspaces)

---

## Phase 0 — Backend Modifications (Go)

**Why first**: Frontend depends on new endpoints and cookie behavior.

### 0.1 — Multi-origin CORS
- Modify CORS middleware to accept comma-separated origins from `CORS_ORIGIN`
- Origins: `https://public.wirehire.com, https://employer.wirehire.com, https://admin.wirehire.com`
- Also accept `http://localhost:5173` (and any port per-app) in dev

### 0.2 — httpOnly Cookie on Login
- `POST /api/auth/login` — also sets `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Lax; Path=/; Domain=.wirehire.com`
- `POST /api/admin/login` — same cookie behavior
- New `POST /api/auth/logout` — clears the cookie
- New `POST /api/admin/logout` — clears the cookie

### 0.3 — Cookie-Aware Auth Middleware
- Check `Authorization: Bearer <token>` header first (existing behavior)
- If missing, read `token` cookie from request
- Both paths work interchangeably

### 0.4 — Admin Verify Employer Endpoints
- `GET /api/admin/employers/pending` — employers where `verified = 0`
- `PUT /api/admin/employers/{id}/verify` — set `verified = 1`
- Both guarded by `AdminAuth` + `ModeratorOrAbove`

### 0.5 — Minor Backend Config
- Update `CORS_ORIGIN` default or accept comma-separated list for dev

---

## Phase 1 — Monorepo Scaffold

### 1.1 — Root setup
- `pnpm-workspace.yaml` — defines `apps/*` and `packages/*`
- Root `package.json` with scripts: `dev`, `build`, `lint`
- `tsconfig.base.json` — strict mode, shared compiler options
- `.gitignore` for node_modules, dist, .env

### 1.2 — App skeletons
- `apps/public/` — `npm create @tanstack/start` scaffold → SSR
- `apps/employer/` — `npm create vite` + TanStack Router + TanStack Query
- `apps/admin/` — `npm create vite` + TanStack Router + TanStack Query
- Tailwind CSS v4 setup in each app

### 1.3 — Shared package skeleton
- `packages/shared/` — `package.json` with name `@wirehire/shared`
- Configures TypeScript path aliases across all apps

---

## Phase 2 — Shared Package (`@wirehire/shared`)

### 2.1 — TypeScript Types
Exact mirrors of Go models:

```typescript
// types/job.ts
export interface JobApp {
  id: number
  client_id: number
  job_title: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  category: string
  location: string
  client_email: string
  phone_number: string | null
  company_name: string
  company_website: string
  company_logo_url: string
  company_bio: string
}

// types/employer.ts
export interface Employer {
  id: number
  email: string
  phone_number: string | null
  verified: number
  company_name: string
  company_website: string
  company_logo_url: string
  company_bio: string
  created_by_admin_id: number | null
  jobs_total: number
  jobs_approved: number
}

// types/admin.ts
export interface Admin {
  id: number
  email: string
  admin_role: 'super_admin' | 'moderator'
}

// types/api.ts — request/response types for every endpoint
```

### 2.2 — API Client (TanStack Query)
- `api/client.ts` — fetch wrapper with `credentials: 'include'` for cookies
- Auto-attaches `Authorization` header from in-memory token if available
- Configurable `baseUrl` (defaults to `import.meta.env.VITE_API_URL`)

### 2.3 — Query/Mutation Hooks per domain
- `hooks/useJobs.ts` — `useJobs()`, `useJob(id)`, `useCreateJob()`, `useUpdateJob()`, `useDeleteJob()`
- `hooks/usePublicJobs.ts` — `usePublicJobs()`, `usePublicEmployers()`
- `hooks/useAuth.ts` — `useLogin()`, `useSignup()`, `useLogout()`, `useAuth()`
- `hooks/useAdmin.ts` — `useAdminJobs()`, `useUpdateJobStatus()`, `usePendingEmployers()`, `useVerifyEmployer()`

### 2.4 — Auth Utilities
- `auth/cookie.ts` — read auth state from cookie (for SSR — check `cookies()` from TanStack Start headers)
- `auth/useAuth.tsx` — React context for current user
- Handles both cookie-based and Bearer-token flows

### 2.5 — Constants
- Job categories (matching backend `Categories`)
- API paths as typed constants

---

## Phase 3 — App 1: Public Job Board (SSR with TanStack Start)

### Pages/Routes:

| Route | Type | Content |
|-------|------|---------|
| `/` | SSR | Landing page — hero + featured jobs + search bar |
| `/jobs` | SSR | Full job listing with category filter |
| `/jobs/{id}` | SSR | Job detail with employer contact info |
| `/employers` | SSR | Employer directory (companies with open jobs) |
| `/signup` | CSR+SSR | Employer registration form |

### Key Behaviors:
- **Contact info VISIBLE** — phone number and email shown on job detail
- Search/filter by category, keyword, location (client-side filter on SSR data or TanStack Query refetch)
- SEO: each job gets its own URL with meta tags
- Signup form posts to `POST /api/auth/signup` with validation
- Employer signup CTA on landing page ("Post jobs — Sign up as an employer")
- Static generation where possible (job listing), CSR hydration for interactive parts

---

## Phase 4 — App 2: Employer Dashboard (CSR)

### Routes:

| Route | Auth | Content |
|-------|------|---------|
| `/login` | — | Employer login form |
| `/` | Required | Dashboard — list own jobs with status badges |
| `/jobs/new` | Required | Create job form |
| `/jobs/{id}/edit` | Required | Edit job form |
| `/profile` | Required | Edit company info |

### Key Behaviors:
- Login via `POST /api/auth/login` → sets httpOnly cookie + returns token
- Redirect to `/` on success
- Job form: title, description, category (dropdown), location
- Status badges: pending (yellow), approved (green), rejected (red)
- Edit resets status back to `pending`? (Need to decide — currently the backend doesn't auto-reset status on update)
- Profile: update company_name, company_website, company_bio, phone
- Logout button → `POST /api/auth/logout` → clear cookie → redirect to `/login`

---

## Phase 5 — App 3: Admin Dashboard (CSR)

### Routes:

| Route | Auth | Min Role | Content |
|-------|------|----------|---------|
| `/login` | — | — | Admin login form |
| `/` | Required | moderator | Dashboard — all jobs + stats |
| `/jobs` | Required | moderator | Full job list with approve/reject buttons |
| `/employers` | Required | super_admin | Employer management (list/Create/Edit/Delete) |
| `/employers/pending` | Required | moderator | Pending employer verifications |
| `/admins` | Required | super_admin | Admin account management |

### Key Behaviors:
- **Role-based UI**: moderator sees job moderation + verify employers. Super admin sees everything.
- **Job moderation**: table of all jobs sorted by status. Approve/Reject buttons. Filter tabs: All / Pending / Approved / Rejected.
- **Employer management**: list all employers (with job counts). Create new employer (auto-verified). Edit. Delete. 
- **Pending verification**: list unverified signups with "Verify" button
- **Admin management**: table of admins. Create new admin (email + password + role). Roles: super_admin, moderator.
- RBAC enforced on both frontend (route gating) and backend (middleware)

---

## Phase 6 — Polish & Integration

- Loading skeletons for every page
- Error boundaries and toast notifications
- Responsive layout (mobile-first)
- 404 pages
- CHECK.md tracking
- Build verification (`pnpm build` across all apps)

---

## Backend Deploy Note

The Go backend uses **SQLite**, which has ephemeral storage on Vercel serverless.
Options to discuss:
1. **VPS (DigitalOcean/$5-10 VPS)** — simplest for SQLite
2. **Vercel + Turso/LibSQL** — SQLite-compatible edge database
3. **Migrate to PostgreSQL** — requires backend rewrite of queries

Frontends deploy to Vercel directly (each app as a separate project).

---

## File Map

```
/home/retr0rev/jobfront2/
├── pnpm-workspace.yaml
├── package.json                 # root scripts
├── tsconfig.base.json
├── .gitignore
│
├── apps/
│   ├── public/                  # TanStack Start SSR
│   │   ├── app.config.ts
│   │   ├── app/
│   │   │   ├── routes/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── jobs.tsx
│   │   │   │   ├── jobs.$id.tsx
│   │   │   │   ├── employers.tsx
│   │   │   │   └── signup.tsx
│   │   │   ├── components/
│   │   │   ├── styles/
│   │   │   └── client.tsx
│   │   └── package.json
│   │
│   ├── employer/                # Vite CSR
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── __root.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── login.tsx
│   │   │   │   ├── jobs.new.tsx
│   │   │   │   ├── jobs.$id.edit.tsx
│   │   │   │   └── profile.tsx
│   │   │   ├── components/
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   └── admin/                   # Vite CSR
│       ├── vite.config.ts
│       ├── src/
│       │   ├── routes/
│       │   │   ├── __root.tsx
│       │   │   ├── index.tsx
│       │   │   ├── login.tsx
│       │   │   ├── jobs.tsx
│       │   │   ├── employers.tsx
│       │   │   ├── employers.pending.tsx
│       │   │   └── admins.tsx
│       │   └── main.tsx
│       └── package.json
│
└── packages/
    └── shared/
        ├── package.json         # @wirehire/shared
        └── src/
            ├── types/
            │   ├── index.ts
            │   ├── job.ts
            │   ├── employer.ts
            │   ├── admin.ts
            │   └── api.ts
            ├── api/
            │   ├── client.ts
            │   └── paths.ts
            ├── hooks/
            │   ├── useJobs.ts
            │   ├── usePublicJobs.ts
            │   ├── useAuth.ts
            │   └── useAdmin.ts
            ├── auth/
            │   └── index.ts
            └── constants/
                └── categories.ts
```

---

## Implementation Order

```
Phase 0 (Backend) → Phase 1 (Scaffold) → Phase 2 (Shared) 
→ Phase 3 (App 1) + Phase 4 (App 2) + Phase 5 (App 3) in parallel
→ Phase 6 (Polish)
```
