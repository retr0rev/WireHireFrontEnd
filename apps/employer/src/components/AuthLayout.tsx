import { Link, useNavigate } from '@tanstack/react-router'
import { useUnifiedAuth } from '@wirehire/shared'
import { useState } from 'react'
import { Skeleton } from './Skeleton'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { role, user, admin, isLoading, logout } = useUnifiedAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  if (!user && !admin) {
    // Not authenticated — redirect to login. We use window.location here
    // instead of the router so this works even when the router context hasn't
    // caught up with the auth state yet.
    window.location.href = '/login'
    return null
  }

  const displayName = user?.company_name ?? admin?.email ?? 'User'
  const roleBadge = role === 'admin' ? 'Admin' : 'Employer'
  const isSuperAdmin = admin?.admin_role === 'super_admin'

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900">WireHire</h1>
            <p className="text-sm text-gray-500 truncate">{displayName}</p>
            <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {roleBadge}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" onClick={() => setMobileOpen(false)}>
          {role === 'admin' ? (
            <>
              <NavLink to="/admin/">Dashboard</NavLink>
              <NavLink to="/admin/jobs">Job Moderation</NavLink>
              <NavLink to="/admin/pending">Pending Approvals</NavLink>
              {isSuperAdmin && <NavLink to="/admin/employers">Employers</NavLink>}
              {isSuperAdmin && <NavLink to="/admin/admins">Admins</NavLink>}
            </>
          ) : (
            <>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/jobs/new">Post a Job</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </>
          )}
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

      <main className="flex-1 bg-gray-50 p-4 lg:p-8">
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

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-gray-100 [&.active]:font-medium"
    >
      {children}
    </Link>
  )
}
