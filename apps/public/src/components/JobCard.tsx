import { Link } from '@tanstack/react-router'
import type { JobApp } from '@wirehire/shared'

interface JobCardProps { job: JobApp }

export function JobCard({ job }: JobCardProps) {
  return (
    <Link to="/jobs/$id" params={{ id: String(job.id) }}
      className="group block rounded-wh-card border border-wh-outline bg-wh-white transition hover:border-wh-outline-hover hover:bg-wh-surface">
      {job.banner_image_url && (
        <div className="overflow-hidden rounded-t-wh-card">
          <img
            src={job.banner_image_url}
            alt=""
            className="h-32 w-full object-cover transition group-hover:scale-105"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {job.company_logo_url ? (
            <img src={job.company_logo_url} alt={job.company_name} className="h-10 w-10 rounded-wh-card object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-wh-card bg-wh-primary text-sm font-bold text-white">
              {job.company_name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-wh-headline text-lg font-bold leading-tight text-wh-onsurface">{job.job_title}</h3>
            <p className="mt-0.5 font-wh-mono text-[11px] font-medium uppercase tracking-wider text-wh-muted">
              {job.company_name} &middot; {job.location}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-wh-secondary-light px-3 py-1 font-wh-mono text-[11px] font-medium text-wh-secondary">{job.category}</span>
      </div>
      <p className="mb-4 line-clamp-2 font-wh-body text-sm leading-relaxed text-wh-muted">{job.description}</p>
      <div className="flex flex-wrap items-center gap-3 border-t border-wh-outline pt-4">
        <span className="inline-flex items-center gap-1.5 font-wh-body text-xs font-medium text-wh-primary">
          <svg className="h-3.5 w-3.5 text-wh-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          {job.client_email}
        </span>
        {job.phone_number && (
          <span className="inline-flex items-center gap-1.5 font-wh-body text-xs font-medium text-wh-primary">
            <svg className="h-3.5 w-3.5 text-wh-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {job.phone_number}
          </span>
        )}
        {job.company_website && (
          <span className="inline-flex items-center gap-1.5 font-wh-body text-xs font-medium text-wh-secondary">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            {job.company_website}
          </span>
        )}
      </div>
      </div>
    </Link>
  )
}
