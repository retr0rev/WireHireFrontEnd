import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCreateJob } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'
import { JobForm } from '../components/JobForm'
import type { CreateJobRequest } from '@wirehire/shared'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/jobs/new')({
  component: NewJobPage,
})

function NewJobPage() {
  const createJob = useCreateJob()
  const router = useRouter()

  const handleSubmit = async (data: CreateJobRequest) => {
    try {
      await createJob.mutateAsync(data)
      toast.success('Job posted — waiting for admin approval')
      router.navigate({ to: '/' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post job')
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Post a New Job</h1>
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <JobForm onSubmit={handleSubmit} submitLabel="Post Job" />
      </div>
    </AuthLayout>
  )
}
