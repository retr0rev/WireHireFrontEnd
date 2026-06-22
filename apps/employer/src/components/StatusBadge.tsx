import type { JobStatus } from '@wirehire/shared'

const colors: Record<JobStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors[status]}`}
    >
      {status}
    </span>
  )
}
