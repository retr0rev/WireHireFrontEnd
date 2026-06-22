import { Link, useRouter } from '@tanstack/react-router'
import { useEmployerAuth } from '@wirehire/shared'
import { apiFetch, API_PATHS } from '@wirehire/shared'
import { useState } from 'react'
import { Skeleton } from './Skeleton'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useEmployerAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  if (!user) {
    router.navigate({ to: '/login' })
    return null
  }

  const handleLogout = async () => {
    await apiFetch(API_PATHS.authLogout, { method: 'POST' })
    router.navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900">WireHire</h1>
            <p className="mt-1 text-sm text-gray-500">{user.company_name}</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" onClick={() => setMobileOpen(false)}>
          <Link
            to="/"
            className="flex rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-gray-100 [&.active]:font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/jobs/new"
            className="flex rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-gray-100 [&.active]:font-medium"
          >
            Post a Job
          </Link>
          <Link
            to="/profile"
            className="flex rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-gray-100 [&.active]:font-medium"
          >
            Profile
          </Link>
        </nav>
        <div className="border-t border-gray-200 px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-50 p-4 lg:p-8">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="mb-4 rounded-lg border border-gray-200 bg-white p-2 lg:hidden"
        >
          ☰
        </button>
        {children}
      </main>
    </div>
  )
}
