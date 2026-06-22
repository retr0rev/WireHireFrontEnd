// Types
export * from './types'

// API
export { apiFetch, ApiFetchError } from './api/client'
export { API_PATHS } from './api/paths'

// Constants
export { JOB_CATEGORIES } from './constants/categories'
export type { JobCategory } from './constants/categories'

// Auth contexts
export {
  EmployerAuthProvider,
  useEmployerAuth,
  AdminAuthProvider,
  useAdminAuth,
} from './auth'

// Hooks — Public
export { usePublicJobs, usePublicEmployers } from './hooks/usePublicJobs'

// Hooks — Employer Jobs
export {
  useMyJobs,
  useMyJob,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
} from './hooks/useJobs'

// Hooks — Auth
export { useSignup, useLogin, useForgotPassword, useResetPassword } from './hooks/useAuth'

// Hooks — Admin
export {
  useAdminJobs,
  useUpdateJobStatus,
  useAdminDeleteJob,
  useAdminEmployers,
  usePendingEmployers,
  useVerifyEmployer,
  useCreateEmployer,
  useUpdateEmployer,
  useDeleteEmployer,
  useAdminList,
  useCreateAdmin,
} from './hooks/useAdmin'
