import { createFileRoute, Link } from '@tanstack/react-router'
import { useMyJobs, useDeleteJob } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import { StatusBadge } from '../components/StatusBadge'
import { TableSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: jobs, isLoading } = useMyJobs()
  const deleteJob = useDeleteJob()

  const handleDelete = async (id: number) => {
    if (confirm('Delete this job?')) {
      deleteJob.mutate(id, {
        onSuccess: () => toast.success('Job deleted'),
        onError: (e) => toast.error(e.message),
      })
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <Link
          to="/jobs/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Post New Job
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : !jobs || jobs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No jobs yet. Post your first job!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5"
            >
              <Link to="/jobs/$id" params={{ id: String(job.id) }} className="flex items-start gap-4 flex-1 group">
                {job.banner_image_url && (
                  <img
                    src={job.banner_image_url}
                    alt="Banner"
                    className="mt-0.5 h-12 w-20 shrink-0 rounded-lg object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-3">
                    {job.company_logo_url && (
                      <img
                        src={job.company_logo_url}
                        alt="Logo"
                        className="h-6 w-6 shrink-0 rounded object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                    <h2 className="font-semibold text-gray-900 truncate group-hover:text-blue-600">{job.job_title}</h2>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {job.category} &middot; {job.location}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  to="/jobs/$id/edit"
                  params={{ id: String(job.id) }}
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AuthLayout>
  )
}
