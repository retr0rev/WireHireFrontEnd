import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAdminList, useCreateAdmin } from '@wirehire/shared'
import type { AdminRole } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import { TableSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/admins')({
  component: AdminsPage,
})

function AdminsPage() {
  const { data: admins, isLoading } = useAdminList()
  const createAdmin = useCreateAdmin()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', role: 'moderator' as AdminRole })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAdmin.mutateAsync(form)
      toast.success('Admin created')
      setShowForm(false)
      setForm({ email: '', password: '', role: 'moderator' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create admin')
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : '+ Add Admin'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 max-w-md rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Create Admin</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              >
                <option value="moderator">Moderator</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={createAdmin.isPending}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {createAdmin.isPending ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      )}

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : !admins || admins.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No admins.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{admin.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {admin.admin_role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AuthLayout>
  )
}
