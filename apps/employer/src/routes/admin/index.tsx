import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useAdminJobs, usePendingEmployers, useAdminList, useUnifiedAuth, apiFetch, API_PATHS } from '@wirehire/shared'
import { AuthLayout } from '../../components/AuthLayout'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
  beforeLoad: ({ context, location }) => {
    void location
    if (context.auth.role !== 'admin') throw redirect({ to: '/login' })
  },
})

function AdminDashboardPage() {
  const { admin } = useUnifiedAuth()
  const { data: jobs } = useAdminJobs()
  const { data: pending } = usePendingEmployers()
  const { data: admins } = useAdminList()
  const isSuperAdmin = admin?.admin_role === 'super_admin'

  const pendingJobs = jobs?.filter((j) => j.status === 'pending').length ?? 0
  const approvedJobs = jobs?.filter((j) => j.status === 'approved').length ?? 0
  const rejectedJobs = jobs?.filter((j) => j.status === 'rejected').length ?? 0

  return (
    <AuthLayout>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Jobs" value={pendingJobs} to="/admin/jobs" color="yellow" />
        <StatCard label="Approved Jobs" value={approvedJobs} to="/admin/jobs" color="green" />
        <StatCard label="Rejected Jobs" value={rejectedJobs} to="/admin/jobs" color="red" />
        <StatCard label="Pending Approvals" value={pending?.length ?? 0} to="/admin/pending" color="blue" />
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard title="Moderate Jobs" description="Review and approve or reject job listings" to="/admin/jobs" />
          <ActionCard title="Pending Approvals" description={`${pending?.length ?? 0} employer${(pending?.length ?? 0) !== 1 ? 's' : ''} awaiting verification`} to="/admin/pending" />
          {isSuperAdmin && (
            <>
              <ActionCard title="Manage Employers" description="View and manage verified employers" to="/admin/employers" />
              <ActionCard title="Manage Admins" description={`${admins?.length ?? 0} admin account${(admins?.length ?? 0) !== 1 ? 's' : ''} configured`} to="/admin/admins" />
            </>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </AuthLayout>
  )
}

function StatCard({ label, value, to, color }: { label: string; value: number; to: string; color: string }) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
  }
  return (
    <Link to={to} className={`rounded-xl border p-6 ${colors[color]} hover:shadow-sm transition-shadow`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  )
}

function ActionCard({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link to={to} className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  )
}

function ChangePasswordForm() {
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirm) { toast.error('Passwords do not match'); return }
    setSaving(true)
    try {
      await apiFetch(API_PATHS.adminMePassword, { method: 'PATCH', body: JSON.stringify({ current_password: current, new_password: newPass }) })
      toast.success('Password updated')
      setCurrent(''); setNewPass(''); setConfirm('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md rounded-xl border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" required minLength={8} value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
        </div>
      </div>
      <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
        {saving ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  )
}
