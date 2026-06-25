import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useMyJob } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import { StatusBadge } from '../components/StatusBadge'
import { Skeleton } from '../components/Skeleton'

export const Route = createFileRoute('/jobs/$id')({
  component: JobDetailPage,
  beforeLoad: ({ context, location }) => {
    void location
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
})

function JobDetailPage() {
  const { id } = Route.useParams()
  const jobId = Number(id)
  const { data: job, isLoading } = useMyJob(jobId)

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="max-w-3xl">
          <Skeleton className="mb-4 h-5 w-24" />
          <div className="rounded-xl border border-gray-200 bg-white">
            <Skeleton className="h-48 w-full rounded-t-xl" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (!job) {
    return (
      <AuthLayout>
        <div className="max-w-3xl py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">This job may have been removed.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">&larr; Back to dashboard</Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="max-w-3xl">
        <Link to="/" className="mb-6 inline-block text-sm font-medium text-gray-500 hover:text-gray-900">&larr; Back to jobs</Link>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {job.banner_image_url && (
            <div className="overflow-hidden">
              <img
                src={job.banner_image_url}
                alt={`${job.company_name} banner`}
                className="h-48 w-full object-cover sm:h-64"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              {job.company_logo_url ? (
                <img src={job.company_logo_url} alt={job.company_name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white">
                  {job.company_name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{job.job_title}</h1>
                  <StatusBadge status={job.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{job.company_name}</span>
                  <span>{job.category}</span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-gray-900">Description</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{job.description}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Contact Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <span className="font-semibold text-gray-900">{job.company_name}</span>
                </div>
                {job.company_website && (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">{job.company_website}</a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href={`mailto:${job.client_email}`} className="font-medium text-blue-600 hover:underline">{job.client_email}</a>
                </div>
                {job.phone_number && (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <a href={`tel:${job.phone_number}`} className="font-medium text-blue-600 hover:underline">{job.phone_number}</a>
                  </div>
                )}
                {job.company_bio && (
                  <p className="border-t border-gray-200 pt-3 text-sm leading-relaxed text-gray-500">{job.company_bio}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to="/jobs/$id/edit"
                params={{ id: String(job.id) }}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Edit Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
