// Re-export unified auth as the single auth provider.
// The old EmployerAuthProvider / AdminAuthProvider were removed in T15 (RBAC consolidation).
export { UnifiedAuthProvider, useUnifiedAuth } from './unified'
