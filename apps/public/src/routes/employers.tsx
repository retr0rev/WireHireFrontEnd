import { createFileRoute, Link } from '@tanstack/react-router'
import { usePublicEmployers } from '@wirehire/shared'
import { Skeleton } from '../components/Skeleton'

export const Route = createFileRoute('/employers')({ component: EmployersPage })

function EmployersPage() {
  const { data: employers, isLoading } = usePublicEmployers()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:py-16 lg:px-10">
      <div className="mb-8 sm:mb-10">
        <h1 className="font-wh-headline text-2xl font-extrabold text-wh-primary sm:text-3xl">Employers</h1>
        <p className="mt-1 font-wh-body text-wh-muted">Verified companies hiring on WireHire</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1,2,3,4].map((i) => (
            <div key={i} className="rounded-wh-card border border-wh-outline bg-wh-white p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12" />
                <div className="flex-1"><Skeleton className="mb-2 h-5 w-2/3" /><Skeleton className="h-4 w-1/3" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : !employers || employers.length === 0 ? (
        <div className="rounded-wh-card border border-dashed border-wh-outline bg-wh-white py-24 text-center">
          <p className="font-wh-body text-wh-muted">No verified employers yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {employers.map((emp) => (
            <Link key={emp.id} to="/jobs" className="rounded-wh-card border border-wh-outline bg-wh-white p-6 transition hover:border-wh-outline-hover hover:bg-wh-surface">
              <div className="flex items-center gap-4">
                {emp.company_logo_url ? (
                  <img src={emp.company_logo_url} alt={emp.company_name} className="h-12 w-12 rounded-wh-card object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-wh-card bg-wh-primary text-lg font-bold text-white">{emp.company_name.charAt(0)}</div>
                )}
                <div>
                  <h2 className="font-wh-headline text-lg font-bold text-wh-primary">{emp.company_name}</h2>
                  <p className="font-wh-mono text-[11px] font-medium text-wh-muted">{emp.jobs_approved} open position{emp.jobs_approved !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {emp.company_bio && <p className="mt-4 line-clamp-2 font-wh-body text-sm leading-relaxed text-wh-muted">{emp.company_bio}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
