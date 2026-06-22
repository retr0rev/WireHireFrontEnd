# CHECK.md — WireHire Progress Tracker

**Continue command**: Review this file, find the last incomplete phase, and continue from there.

---

## Phase 0: Backend Modifications (Go)

Status: ✅ Complete

### 0.1 — Multi-origin CORS
- [x] Existing middleware already splits on comma — verified
- [x] Test with multiple origins

### 0.2 — httpOnly Cookie on Login
- [x] `internal/middleware/auth.go` — `SetAuthCookie()` / `ClearAuthCookie()` helpers
- [x] `internal/handlers/company.go` — `Login()` sets cookie
- [x] `internal/handlers/admin.go` — `Login()` sets cookie
- [x] `POST /api/auth/logout` handler added
- [x] `POST /api/admin/logout` handler added
- [x] Routes registered in `cmd/server/main.go`

### 0.3 — Cookie-Aware Auth Middleware
- [x] `requireAuth()` falls back to `token` cookie when `Authorization` header absent
- [x] JWT parsed from cookie, validated same way

### 0.4 — Admin Verify Employer Endpoints
- [x] `internal/repository/company.go` — `ListPending()` queries `verified = 0`
- [x] `internal/handlers/admin.go` — `ListPendingEmployers()`, `VerifyEmployer()` handlers
- [x] Routes registered + smoke tested

### 0.5 — Test backend
- [x] `go build ./cmd/server` — compiles clean
- [x] Smoke tested login, cookie auth, pending employers, verify, logout via curl

---

## Phase 1: Monorepo Scaffold

Status: ✅ Complete

- [x] Root `pnpm-workspace.yaml`
- [x] Root `package.json` with build/dev scripts
- [x] `tsconfig.base.json` — strict
- [x] `.gitignore`
- [x] `apps/public/` — TanStack Start scaffold
- [x] `apps/employer/` — Vite + React + TanStack Router scaffold
- [x] `apps/admin/` — Vite + React + TanStack Router scaffold
- [x] `packages/shared/` — `@wirehire/shared` scaffold
- [x] Tailwind CSS v4 in each app (`@import "tailwindcss"`)
- [x] `pnpm install` — 567 packages, resolves clean

---

## Phase 2: Shared Package (@wirehire/shared)

Status: ✅ Complete

### 2.1 — TypeScript Types
- [x] `src/types/job.ts`, `employer.ts`, `admin.ts`, `api.ts`, `index.ts`

### 2.2 — API Client
- [x] `src/api/client.ts` — fetch wrapper with `credentials: 'include'`
- [x] `src/api/paths.ts` — endpoint constants for all apps

### 2.3 — Hooks
- [x] `src/hooks/usePublicJobs.ts` — `usePublicJobs()`, `usePublicEmployers()`
- [x] `src/hooks/useJobs.ts` — CRUD hooks for authenticated clients
- [x] `src/hooks/useAuth.ts` — `useLogin()`, `useSignup()`, `useForgotPassword()`, `useResetPassword()`
- [x] `src/hooks/useAdmin.ts` — admin-specific hooks

### 2.4 — Auth Utilities
- [x] `src/auth/index.tsx` — `EmployerAuthProvider`, `useEmployerAuth()`, `AdminAuthProvider`, `useAdminAuth()`

### 2.5 — Constants
- [x] `src/constants/categories.ts`

---

## Phase 3: App 1 — Public Job Board (SSR)

Status: ✅ Complete

### Routes
- [x] `/` — Landing page with hero, featured jobs, employer CTA
- [x] `/jobs` — Full listing with search + category filter
- [x] `/jobs/{id}` — Job detail with employer phone + email visible
- [x] `/employers` — Employer directory
- [x] `/signup` — Employer registration form

### Components
- [x] `JobCard` — reusable job card component
- [x] `Navbar` — site navigation
- [x] `Footer`

### SSR Details
- [x] Meta tags per page via `head()` function
- [x] TanStack Query for CSR client-side search/filter
- [x] Loading states

---

## Phase 4: App 2 — Employer Dashboard (CSR)

Status: ✅ Complete

### Routes
- [x] `/login` — employer login form with error handling
- [x] `/` — dashboard (list own jobs with delete, status badges)
- [x] `/jobs/new` — create job form
- [x] `/jobs/{id}/edit` — edit job form with pre-filled data
- [x] `/profile` — edit company info (name, website, logo, phone, bio)

### Components
- [x] `AuthLayout` — sidebar navigation with logout, auth guard
- [x] `JobForm` — shared create/edit form
- [x] `StatusBadge` — pending/approved/rejected badge

---

## Phase 5: App 3 — Admin Dashboard (CSR)

Status: ✅ Complete

### Routes
- [x] `/login` — admin login form with error handling
- [x] `/` — dashboard overview (stats cards, quick actions, role-aware)
- [x] `/jobs` — all jobs table with approve/reject/delete, tab filters
- [x] `/employers` — employer list + create (super_admin)
- [x] `/employers/pending` — pending employer verifications (verify button)
- [x] `/admins` — admin list + create (super_admin)

### Components
- [x] `AuthLayout` — sidebar navigation, role-guarded links, logout

---

## Phase 6: Polish & Integration

Status: ❌ Not started

- [ ] Error boundaries per app
- [ ] Toast notifications for actions
- [ ] Responsive layout (mobile)
- [ ] Loading skeletons
- [ ] 404 pages
- [ ] `pnpm build` passes for all apps
- [ ] LSP diagnostics clean
- [ ] Backend + frontend integration smoke test

---

## Notes

- **App 1 uses TanStack Start SSR** — components must avoid `window`/`localStorage` in SSR context
- **httpOnly cookies** — each fetch must include `credentials: 'include'`
- **CORS** — backend must list all 3 frontend origins + localhost dev ports
- **Backend deploy** — SQLite doesn't work on Vercel serverless; need VPS or Turso
