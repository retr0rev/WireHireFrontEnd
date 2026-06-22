import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMyJob, useUpdateJob } from '@wirehire/shared'
import { Skeleton } from '../components/Skeleton'
import { AuthLayout } from '../components/AuthLayout'
import { JobForm } from '../components/JobForm'
import type { CreateJobRequest } from '@wirehire/shared'

export const Route = createFileRoute('/jobs/$id/edit')({
  component: EditJobPage,
})

function EditJobPage() {
  const { id } = Route.useParams()
  const jobId = Number(id)
  const { data: job, isLoading } = useMyJob(jobId)
  const updateJob = useUpdateJob(jobId)
  const router = useRouter()

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
          <Skeleton className="mb-4 h-8 w-1/3" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-2/3" />
          <Skeleton className="h-10 w-1/4" />
        </div>
      </AuthLayout>
    )
  }

  if (!job) {
    return (
      <AuthLayout>
        <p className="text-gray-500">Job not found.</p>
      </AuthLayout>
    )
  }

  const handleSubmit = async (data: CreateJobRequest) => {
    await updateJob.mutateAsync(data)
    router.navigate({ to: '/' })
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Job</h1>
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <JobForm
          initial={{
            job_title: job.job_title,
            description: job.description,
            category: job.category,
            location: job.location,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </AuthLayout>
  )
}
