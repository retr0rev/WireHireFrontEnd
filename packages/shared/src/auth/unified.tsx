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

// In-memory CSRF token store (cross-origin: cookie not readable by JS)
let csrfTokenStore: string | null = null

function setCSRFToken(token: string) {
  csrfTokenStore = token
}

function getCSRFToken(): string | null {
  return csrfTokenStore
}

/** Exported for apiFetch to read CSRF token from memory (cross-origin). */
export { getCSRFToken }

/** Fetch a CSRF token from the backend and store it in memory. */
async function fetchCSRFToken(): Promise<void> {
  try {
    const res = await apiFetch<{ csrf_token: string }>('/api/auth/csrf')
    if (res?.csrf_token) {
      setCSRFToken(res.csrf_token)
    }
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

  // On mount, probe both endpoints in parallel. Complete as soon as one
  // succeeds. If both fail (or timeout), isLoading becomes false.
  useEffect(() => {
    console.log('[Probe] useEffect started')
    cancelled.current = false  // Reset for React StrictMode double-invoke
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT)

    let resolved = false

    const checkAndSet = (role: 'employer' | 'admin', user: Client | Admin) => {
      console.log('[Probe] checkAndSet called', { role, resolved, cancelled: cancelled.current })
      if (resolved || cancelled.current) return
      resolved = true
      clearTimeout(timeout)
      if (role === 'employer') {
        setRole('employer')
        setUser(user as Client)
        setAdmin(null)
      } else {
        setRole('admin')
        setAdmin(user as Admin)
        setUser(null)
      }
      setIsLoading(false)
      console.log('[Probe] setIsLoading(false) called')
    }

    const employerPromise = apiFetch<Client>(API_PATHS.authMe, { signal: controller.signal })
      .then((result) => {
        console.log('[Probe] employer then')
        checkAndSet('employer', result)
      })
      .catch((err) => {
        console.log('[Probe] employer catch:', err?.message ?? err)
      })

    const adminPromise = apiFetch<Admin>(API_PATHS.adminMe, { signal: controller.signal })
      .then((result) => {
        console.log('[Probe] admin then')
        checkAndSet('admin', result)
      })
      .catch((err) => {
        console.log('[Probe] admin catch:', err?.message ?? err)
      })
      .catch(() => {})

    // Wait for both to complete, then if neither succeeded, mark as done
    Promise.allSettled([employerPromise, adminPromise]).then(() => {
      if (!resolved && !cancelled.current) {
        clearTimeout(timeout)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled.current = true
      controller.abort()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Prime the CSRF cookie so apiFetch can read it and attach X-CSRF-Token.
    await fetchCSRFToken()

    try {
      await apiFetch(API_PATHS.adminLogin, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const profile = await apiFetch<Admin>(API_PATHS.adminMe)
      setRole('admin')
      setAdmin(profile)
      setUser(null)
      return { role: 'admin' as const }
    } catch {

      await apiFetch(API_PATHS.authLogin, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const profile = await apiFetch<Client>(API_PATHS.authMe)
      setRole('employer')
      setUser(profile)
      setAdmin(null)
      return { role: 'employer' as const }
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
