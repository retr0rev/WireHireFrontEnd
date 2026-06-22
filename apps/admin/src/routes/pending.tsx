import { createFileRoute } from '@tanstack/react-router'
import { usePendingEmployers, useVerifyEmployer, useDeleteEmployer } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import { TableSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/pending')({
  component: PendingPage,
})

function PendingPage() {
  const { data: pending, isLoading } = usePendingEmployers()
  const verify = useVerifyEmployer()
  const deny = useDeleteEmployer()

  const handleApprove = (id: number, name: string) => {
    verify.mutate(id, {
      onSuccess: () => toast.success(`${name} approved`),
      onError: (e) => toast.error(e.message),
    })
  }

  const handleDeny = (id: number, name: string) => {
    if (!confirm(`Deny and delete ${name}? This will permanently remove their account.`)) return
    deny.mutate(id, {
      onSuccess: () => toast.success(`${name} denied & removed`),
      onError: (e) => toast.error(e.message),
    })
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">
          {pending?.length ?? 0} employer{pending?.length !== 1 ? 's' : ''} waiting for review
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : !pending || pending.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">All Clear</h3>
          <p className="text-sm text-gray-500">No pending employer registrations to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((emp) => (
            <div key={emp.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-xl font-bold text-amber-700">
                      {emp.company_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{emp.company_name}</h3>
                      <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
                        <Info label="Email" value={emp.email} />
                        {emp.phone_number && <Info label="Phone" value={emp.phone_number} />}
                        {emp.company_website && <Info label="Website" value={emp.company_website} />}
                        {emp.company_logo_url && <Info label="Logo URL" value={emp.company_logo_url} />}
                      </div>
                      {emp.company_bio && (
                        <div className="mt-3">
                          <span className="text-xs font-medium text-gray-500">Bio</span>
                          <p className="mt-0.5 text-sm text-gray-600">{emp.company_bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => handleApprove(emp.id, emp.company_name)}
                  disabled={verify.isPending}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50 transition-colors"
                >
                  ✓ Approve
                </button>
                <div className="w-px bg-gray-100" />
                <button
                  onClick={() => handleDeny(emp.id, emp.company_name)}
                  disabled={deny.isPending}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  ✕ Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AuthLayout>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <p className="text-sm text-gray-700 truncate max-w-xs">{value}</p>
    </div>
  )
}
