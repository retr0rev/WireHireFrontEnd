import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'
import type { Admin, Client } from '../types'

/** Fetch a CSRF token from the backend to prime the csrf cookie. */
async function fetchCSRFToken(): Promise<void> {
  // GET /api/auth/csrf sets the csrf cookie (non-HttpOnly, SameSite=None).
  // The apiFetch call adds nothing for GET — the cookie is set by the response.
  try {
    await apiFetch<{ csrf_token: string }>('/api/auth/csrf')
    // The cookie is set via Set-Cookie on the response.
  } catch {
    // Silent — the probe failures are OK; login will fail with a clear error.
  }
}

// ─── Unified Auth Context ───────────────────────────────────────────

export type AuthRole = 'employer' | 'admin'

export interface UnifiedAuthState {
  role: AuthRole | null
  user: Client | null
  admin: Admin | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ role: AuthRole }>
  loginAsEmployer: (email: string, password: string) => Promise<Client>
  loginAsAdmin: (email: string, password: string) => Promise<Admin>
  logout: () => Promise<void>
}

const PROBE_TIMEOUT = 5000

const UnifiedAuthContext = createContext<UnifiedAuthState | null>(null)

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AuthRole | null>(null)
  const [user, setUser] = useState<Client | null>(null)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const cancelled = useRef(false)

  // On mount, probe both endpoints in parallel.
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT)

    Promise.allSettled([
      apiFetch<Client>(API_PATHS.authMe, { signal: controller.signal }),
      apiFetch<Admin>(API_PATHS.adminMe, { signal: controller.signal }),
    ]).then(([employerRes, adminRes]) => {
      clearTimeout(timeout)
      if (cancelled.current) return

      if (adminRes.status === 'fulfilled') {
        // Admin takes priority if both succeed (edge case).
        setRole('admin')
        setAdmin(adminRes.value)
      } else if (employerRes.status === 'fulfilled') {
        setRole('employer')
        setUser(employerRes.value)
      }
      // Both failed → role stays null, user/admin stay null.
      setIsLoading(false)
    })

    return () => {
      cancelled.current = true
      controller.abort()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Prime the CSRF cookie so apiFetch can read it and attach X-CSRF-Token.
    await fetchCSRFToken()

    // Try employer first, fall back to admin.
    try {
      await apiFetch(API_PATHS.authLogin, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const profile = await apiFetch<Client>(API_PATHS.authMe)
      setRole('employer')
      setUser(profile)
      setAdmin(null)
      return { role: 'employer' as const }
    } catch {
      // Employer failed — try admin.
      await apiFetch(API_PATHS.adminLogin, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const profile = await apiFetch<Admin>(API_PATHS.adminMe)
      setRole('admin')
      setAdmin(profile)
      setUser(null)
      return { role: 'admin' as const }
    }
  }, [])

  const loginAsEmployer = useCallback(async (email: string, password: string) => {
    await fetchCSRFToken()
    await apiFetch(API_PATHS.authLogin, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const profile = await apiFetch<Client>(API_PATHS.authMe)
    setRole('employer')
    setUser(profile)
    setAdmin(null)
    return profile
  }, [])

  const loginAsAdmin = useCallback(async (email: string, password: string) => {
    await fetchCSRFToken()
    await apiFetch(API_PATHS.adminLogin, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const profile = await apiFetch<Admin>(API_PATHS.adminMe)
    setRole('admin')
    setAdmin(profile)
    setUser(null)
    return profile
  }, [])

  const logout = useCallback(async () => {
    if (role === 'admin') {
      await apiFetch(API_PATHS.adminLogout, { method: 'POST' })
    } else {
      // Employer or unknown — try auth logout.
      await apiFetch(API_PATHS.authLogout, { method: 'POST' })
    }
    setRole(null)
    setUser(null)
    setAdmin(null)
  }, [role])

  return (
    <UnifiedAuthContext.Provider
      value={{ role, user, admin, isLoading, login, loginAsEmployer, loginAsAdmin, logout }}
    >
      {children}
    </UnifiedAuthContext.Provider>
  )
}

export function useUnifiedAuth() {
  const ctx = useContext(UnifiedAuthContext)
  if (!ctx) throw new Error('useUnifiedAuth must be inside UnifiedAuthProvider')
  return ctx
}
