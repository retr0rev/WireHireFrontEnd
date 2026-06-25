import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { usePublicJobs, JOB_CATEGORIES } from '@wirehire/shared'
import { JobCard } from '../components/JobCard'
import { CardSkeleton } from '../components/Skeleton'

export const Route = createFileRoute('/jobs/')({ component: JobsIndexPage })

function JobsIndexPage() {
  const { data: jobs, isLoading } = usePublicJobs()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    if (!jobs) return []
    return jobs.filter((job) => {
      const s = search.toLowerCase()
      const ms = !s || job.job_title.toLowerCase().includes(s) || job.company_name.toLowerCase().includes(s) || job.location.toLowerCase().includes(s)
      const mc = category === 'All' || job.category === category
      return ms && mc
    })
  }, [jobs, search, category])

  return (
    <>
      <div className="mb-8 sm:mb-10">
        <h1 className="font-wh-headline text-2xl font-extrabold text-wh-primary sm:text-3xl">Browse Jobs</h1>
        <p className="mt-1 font-wh-body text-wh-muted">Search across all verified listings</p>
      </div>

      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        <input type="text" placeholder="Search by title, company, or location..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface placeholder:text-wh-muted focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none">
          <option value="All">All Categories</option>
          {JOB_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {isLoading ? <CardSkeleton count={6} /> : filtered.length === 0 ? (
        <div className="rounded-wh-card border border-dashed border-wh-outline bg-wh-white py-24 text-center">
          <p className="font-wh-body text-wh-muted">No jobs match your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </>
  )
}
