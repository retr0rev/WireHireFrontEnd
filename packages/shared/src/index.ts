// Types
export * from './types'

// API
export { apiFetch, ApiFetchError, getCookie } from './api/client'
export { API_PATHS } from './api/paths'

// Components
export { ImageUpload } from './components/ImageUpload'

// Constants
export { JOB_CATEGORIES } from './constants/categories'
export type { JobCategory } from './constants/categories'

// Auth contexts
export { UnifiedAuthProvider, useUnifiedAuth } from './auth/unified'
export type { AuthRole, UnifiedAuthState } from './auth/unified'

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
