import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'
import type { Admin, Client } from '../types'

// ─── Employer Auth Context ───────────────────────────────────────────

interface EmployerAuthState {
  user: Client | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<Client>
  logout: () => Promise<void>
}

const EmployerAuthContext = createContext<EmployerAuthState | null>(null)

export function EmployerAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, check if already authenticated via cookie
  useEffect(() => {
    apiFetch<Client>(API_PATHS.authMe)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await apiFetch<{ token: string; email: string; company_name: string }>(
      API_PATHS.authLogin,
      { method: 'POST', body: JSON.stringify({ email, password }) },
    )
    // Fetch the full profile after login — cookie is now set
    const profile = await apiFetch<Client>(API_PATHS.authMe)
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(async () => {
    await apiFetch(API_PATHS.authLogout, { method: 'POST' })
    setUser(null)
  }, [])

  return (
    <EmployerAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </EmployerAuthContext.Provider>
  )
}

export function useEmployerAuth() {
  const ctx = useContext(EmployerAuthContext)
  if (!ctx) throw new Error('useEmployerAuth must be inside EmployerAuthProvider')
  return ctx
}

// ─── Admin Auth Context ──────────────────────────────────────────────

interface AdminAuthState {
  admin: Admin | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<Admin>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthState | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch<Admin>(API_PATHS.adminMe)
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await apiFetch<Admin>(
      API_PATHS.adminLogin,
      { method: 'POST', body: JSON.stringify({ email, password }) },
    )
    // Fetch the full profile after login — cookie is now set
    const profile = await apiFetch<Admin>(API_PATHS.adminMe)
    setAdmin(profile)
    return profile
  }, [])

  const logout = useCallback(async () => {
    await apiFetch(API_PATHS.adminLogout, { method: 'POST' })
    setAdmin(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider')
  return ctx
}
