import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAdminJobs, useUpdateJobStatus, useAdminDeleteJob } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import type { JobStatus } from '@wirehire/shared'
import { TableSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/jobs')({
  component: JobsPage,
})

const tabs: (JobStatus | 'all')[] = ['all', 'pending', 'approved', 'rejected']

function JobsPage() {
  const { data: jobs, isLoading } = useAdminJobs()
  const updateStatus = useUpdateJobStatus()
  const deleteJob = useAdminDeleteJob()
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? jobs : jobs?.filter((j) => j.status === filter)

  const counts = {
    all: jobs?.length ?? 0,
    pending: jobs?.filter((j) => j.status === 'pending').length ?? 0,
    approved: jobs?.filter((j) => j.status === 'approved').length ?? 0,
    rejected: jobs?.filter((j) => j.status === 'rejected').length ?? 0,
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Job Moderation</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === tab
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-1 text-xs opacity-60">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : !filtered || filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No jobs found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 font-medium text-gray-600">Employer</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{job.job_title}</p>
                    <p className="text-xs text-gray-500">{job.company_name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{job.client_email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        job.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : job.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {job.status !== 'approved' && (
                        <button
                          onClick={() =>
                            updateStatus.mutate(
                              { id: job.id, status: 'approved' },
                              {
                                onSuccess: () => toast.success('Job approved'),
                                onError: (e) => toast.error(e.message),
                              },
                            )
                          }
                          className="rounded px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                        >
                          Approve
                        </button>
                      )}
                      {job.status !== 'rejected' && (
                        <button
                          onClick={() =>
                            updateStatus.mutate(
                              { id: job.id, status: 'rejected' },
                              {
                                onSuccess: () => toast.success('Job rejected'),
                                onError: (e) => toast.error(e.message),
                              },
                            )
                          }
                          className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Delete this job?'))
                            deleteJob.mutate(job.id, {
                              onSuccess: () => toast.success('Job deleted'),
                              onError: (e) => toast.error(e.message),
                            })
                        }}
                        className="rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
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
