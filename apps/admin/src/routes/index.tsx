import { createFileRoute, Link } from '@tanstack/react-router'
import { useAdminJobs, usePendingEmployers, useAdminList, useAdminAuth } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { admin } = useAdminAuth()
  const { data: jobs } = useAdminJobs()
  const { data: pending } = usePendingEmployers()
  const { data: admins } = useAdminList()
  const isSuperAdmin = admin?.admin_role === 'super_admin'

  const pendingJobs = jobs?.filter((j) => j.status === 'pending').length ?? 0
  const approvedJobs = jobs?.filter((j) => j.status === 'approved').length ?? 0
  const rejectedJobs = jobs?.filter((j) => j.status === 'rejected').length ?? 0

  return (
    <AuthLayout>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Pending Jobs"
          value={pendingJobs}
          to="/jobs"
          color="yellow"
        />
        <DashboardCard
          label="Approved Jobs"
          value={approvedJobs}
          to="/jobs"
          color="green"
        />
        <DashboardCard
          label="Rejected Jobs"
          value={rejectedJobs}
          to="/jobs"
          color="red"
        />
        <DashboardCard
          label="Pending Verifications"
          value={pending?.length ?? 0}
          to="/employers/pending"
          color="blue"
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Moderate Jobs"
            description="Review and approve or reject job listings"
            to="/jobs"
          />
          <QuickActionCard
            title="Verify Employers"
            description={`${pending?.length ?? 0} employer${(pending?.length ?? 0) !== 1 ? 's' : ''} awaiting verification`}
            to="/employers/pending"
          />
          {isSuperAdmin && (
            <>
              <QuickActionCard
                title="Manage Employers"
                description={`${jobs?.length ? 'View and manage registered employers' : 'No employers registered yet'}`}
                to="/employers"
              />
              <QuickActionCard
                title="Manage Admins"
                description={`${admins?.length ?? 0} admin account${(admins?.length ?? 0) !== 1 ? 's' : ''} configured`}
                to="/admins"
              />
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

function DashboardCard({
  label,
  value,
  to,
  color,
}: {
  label: string
  value: number
  to: string
  color: 'yellow' | 'green' | 'red' | 'blue'
}) {
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
  }

  return (
    <Link
      to={to}
      className={`rounded-xl border p-6 ${colors[color]} hover:shadow-sm transition-shadow`}
    >
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  )
}

function QuickActionCard({
  title,
  description,
  to,
}: {
  title: string
  description: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  )
}
