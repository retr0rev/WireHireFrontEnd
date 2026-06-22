import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  useAdminEmployers,
  useCreateEmployer,
  useDeleteEmployer,
  useUpdateEmployer,
} from '@wirehire/shared'
import type { CreateEmployerRequest } from '@wirehire/shared'
import type { Client } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import { TableSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/employers')({
  component: EmployersPage,
})

function EmployersPage() {
  const { data: allEmployers, isLoading } = useAdminEmployers()
  const createEmployer = useCreateEmployer()
  const deleteEmployer = useDeleteEmployer()
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const [form, setForm] = useState<CreateEmployerRequest>({
    email: '', password: '', company_name: '', phone: '', company_website: '', company_bio: '',
  })

  const employers = useMemo(
    () => (allEmployers ?? []).filter((e) => e.verified === 1),
    [allEmployers],
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await createEmployer.mutateAsync(form)
      toast.success('Employer created')
      setShowForm(false)
      setForm({ email: '', password: '', company_name: '', phone: '', company_website: '', company_bio: '' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create employer'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete ${name} and all their jobs?`)) {
      deleteEmployer.mutate(id, {
        onSuccess: () => toast.success(`${name} deleted`),
        onError: (e) => toast.error(e.message),
      })
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employers</h1>
          <p className="mt-1 text-sm text-gray-500">
            {employers.length} verified employer{employers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : '+ Add Employer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Create Employer Account</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Company Name *</label>
              <input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password *</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
              <input value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Website</label>
              <input value={form.company_website ?? ''} onChange={(e) => setForm({ ...form, company_website: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
              <textarea rows={3} value={form.company_bio ?? ''} onChange={(e) => setForm({ ...form, company_bio: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={createEmployer.isPending} className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {createEmployer.isPending ? 'Creating...' : 'Create Employer'}
          </button>
        </form>
      )}

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : employers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">No verified employers</h3>
          <p className="text-sm text-gray-500">Create an employer or approve one from Pending Approvals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {employers.map((emp) => (
            <EmployerCard
              key={emp.id}
              employer={emp}
              isEditing={editingId === emp.id}
              onEdit={() => setEditingId(editingId === emp.id ? null : emp.id)}
              onDelete={() => handleDelete(emp.id, emp.company_name)}
              onSaved={() => setEditingId(null)}
            />
          ))}
        </div>
      )}
    </AuthLayout>
  )
}

function EmployerCard({
  employer,
  isEditing,
  onEdit,
  onDelete,
  onSaved,
}: {
  employer: Client
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
  onSaved: () => void
}) {
  const update = useUpdateEmployer(employer.id)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    company_name: employer.company_name,
    email: employer.email,
    phone_number: employer.phone_number ?? '',
    company_website: employer.company_website ?? '',
    company_logo_url: employer.company_logo_url ?? '',
    company_bio: employer.company_bio ?? '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await update.mutateAsync({
        company_name: editForm.company_name,
        email: editForm.email,
        phone: editForm.phone_number || undefined,
        company_website: editForm.company_website || undefined,
        company_logo_url: editForm.company_logo_url || undefined,
        company_bio: editForm.company_bio || undefined,
      })
      toast.success('Employer updated')
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Company Name</label>
            <input value={editForm.company_name} onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Email</label>
            <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Phone</label>
            <input value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Website</label>
            <input value={editForm.company_website} onChange={(e) => setEditForm({ ...editForm, company_website: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Logo URL</label>
            <input value={editForm.company_logo_url} onChange={(e) => setEditForm({ ...editForm, company_logo_url: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div />
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">Bio</label>
            <textarea rows={3} value={editForm.company_bio} onChange={(e) => setEditForm({ ...editForm, company_bio: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} disabled={saving} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onEdit} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-lg font-bold text-green-700">
          {employer.company_name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{employer.company_name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <span>{employer.email}</span>
            {employer.phone_number && <span>{employer.phone_number}</span>}
            {employer.company_website && <span className="text-blue-600">{employer.company_website}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Edit
        </button>
        <button onClick={onDelete} className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
          Delete
        </button>
      </div>
    </div>
  )
}
