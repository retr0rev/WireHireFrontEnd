import { createFileRoute, Link } from '@tanstack/react-router'
import { usePublicJobs } from '@wirehire/shared'
import { JobCard } from '../components/JobCard'
import { CardSkeleton } from '../components/Skeleton'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { data: jobs, isLoading } = usePublicJobs()
  const featured = jobs?.slice(0, 6) ?? []

  return (
    <div>
      <section className="border-b border-wh-outline bg-wh-white">
        <div className="mx-auto max-w-[1200px] px-4 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-wh-outline bg-wh-surface px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-wh-success" />
              <span className="font-wh-mono text-[11px] font-medium text-wh-muted">HIRING NOW</span>
            </div>
            <h1 className="font-wh-headline text-5xl font-extrabold leading-[1.1] tracking-[-0.02em] text-wh-primary lg:text-6xl">
              Find Your Next<br />Opportunity
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-wh-body text-lg leading-relaxed text-wh-muted">
              Browse curated listings from verified employers. Your dream role is one click away.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/jobs" className="rounded-[4px] bg-wh-primary px-6 py-3 font-wh-body text-sm font-semibold text-white hover:bg-wh-primary-light transition-colors">
                Browse Jobs
              </Link>
              <a
                href={`${import.meta.env.VITE_EMPLOYER_URL ?? ''}/login`}
                className="rounded-[4px] border border-wh-outline bg-wh-white px-6 py-3 font-wh-body text-sm font-semibold text-wh-primary hover:bg-wh-surface transition-colors"
              >
                Employer Login
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-wh-headline text-2xl font-bold text-wh-primary">Latest Openings</h2>
            <p className="mt-1 font-wh-body text-sm text-wh-muted">Recently posted positions from verified companies</p>
          </div>
          <Link to="/jobs" className="font-wh-body text-sm font-semibold text-wh-secondary hover:underline">
            View all &rarr;
          </Link>
        </div>
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : featured.length === 0 ? (
          <div className="rounded-wh-card border border-dashed border-wh-outline bg-wh-white py-24 text-center">
            <p className="font-wh-body text-wh-muted">No listings yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </section>
    </div>
  )
}
