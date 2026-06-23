import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { usePublicJobs } from '@wirehire/shared'
import { Skeleton } from '../components/Skeleton'

export const Route = createFileRoute('/jobs/$id')({ component: JobDetailPage })

function JobDetailPage() {
  const { id } = useParams({ from: '/jobs/$id' })
  const { data: jobs, isLoading } = usePublicJobs()
  const job = jobs?.find((j) => j.id === Number(id))

  if (isLoading) return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-10">
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="rounded-wh-card border border-wh-outline bg-wh-white p-8">
        <Skeleton className="mb-4 h-12 w-12" />
        <Skeleton className="mb-3 h-8 w-2/3" />
        <Skeleton className="mb-6 h-5 w-1/3" />
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )

  if (!job) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-wh-headline text-2xl font-bold text-wh-primary">Job Not Found</h1>
      <p className="mt-2 font-wh-body text-wh-muted">This listing may have been removed or doesn't exist.</p>
      <Link to="/jobs" className="mt-6 inline-block font-wh-body text-sm font-semibold text-wh-secondary hover:underline">&larr; Back to jobs</Link>
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 lg:px-10">
      <Link to="/jobs" className="mb-6 inline-block font-wh-body text-sm font-medium text-wh-muted hover:text-wh-primary sm:mb-8">&larr; Back to jobs</Link>

      <div className="rounded-wh-card border border-wh-outline bg-wh-white p-5 sm:p-8 lg:p-10">
        <div className="mb-8">
          {job.company_logo_url ? (
            <img src={job.company_logo_url} alt={job.company_name} className="mb-4 h-14 w-14 rounded-wh-card object-cover" />
          ) : (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-wh-card bg-wh-primary text-xl font-bold text-white">{job.company_name.charAt(0)}</div>
          )}
          <h1 className="font-wh-headline text-2xl font-extrabold leading-tight text-wh-primary sm:text-3xl lg:text-4xl">{job.job_title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-wh-body text-sm font-semibold text-wh-onsurface">{job.company_name}</span>
            <span className="font-wh-mono text-xs text-wh-muted">{job.location}</span>
            <span className="rounded-full bg-wh-secondary-light px-3 py-1 font-wh-mono text-[11px] font-medium text-wh-secondary">{job.category}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 font-wh-headline text-lg font-bold text-wh-primary">Description</h2>
          <p className="font-wh-body leading-relaxed text-wh-muted whitespace-pre-wrap">{job.description}</p>
        </div>

        <div className="rounded-wh-card border border-wh-outline bg-wh-surface p-5 sm:p-6">
          <h2 className="mb-4 font-wh-headline text-lg font-bold text-wh-primary">Contact Information</h2>
          <div className="space-y-3 font-wh-body text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-wh-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span className="font-semibold text-wh-onsurface">{job.company_name}</span>
            </div>
            {job.company_website && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-wh-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="font-medium text-wh-secondary hover:underline">{job.company_website}</a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-wh-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <a href={`mailto:${job.client_email}`} className="font-medium text-wh-secondary hover:underline">{job.client_email}</a>
            </div>
            {job.phone_number && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-wh-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href={`tel:${job.phone_number}`} className="font-medium text-wh-secondary hover:underline">{job.phone_number}</a>
              </div>
            )}
            {job.company_bio && <p className="pt-2 font-wh-body text-sm leading-relaxed text-wh-muted border-t border-wh-outline">{job.company_bio}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
