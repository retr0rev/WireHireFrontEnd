export const API_PATHS = {
  // Public
  health: '/health',
  publicJobs: '/api/public/jobs',
  publicEmployers: '/api/public/employers',

  // Auth (employer)
  authSignup: '/api/auth/signup',
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  authVerify: '/api/auth/verify',
  authForgotPassword: '/api/auth/forgot-password',
  authResetPassword: '/api/auth/reset-password',
  authMe: '/api/auth/me',

  // Jobs (employer) - scoped to authenticated client
  jobs: '/api/jobs',
  job: (id: number) => `/api/jobs/${id}`,

  // Admin
  adminLogin: '/api/admin/login',
  adminLogout: '/api/admin/logout',
  adminMe: '/api/admin/me',
  adminJobs: '/api/admin/jobs',
  adminJobStatus: (id: number) => `/api/admin/jobs/${id}/status`,
  adminJobDelete: (id: number) => `/api/admin/jobs/${id}`,
  adminEmployers: '/api/admin/employers',
  adminEmployer: (id: number) => `/api/admin/employers/${id}`,
  adminEmployersPending: '/api/admin/employers/pending',
  adminEmployerVerify: (id: number) => `/api/admin/employers/${id}/verify`,
  adminAdmins: '/api/admin/admins',
} as const
