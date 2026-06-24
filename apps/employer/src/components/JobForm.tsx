import { useState } from 'react'
import { JOB_CATEGORIES, ImageUpload } from '@wirehire/shared'
import type { CreateJobRequest } from '@wirehire/shared'

interface JobFormProps {
  initial?: CreateJobRequest
  onSubmit: (data: CreateJobRequest) => Promise<void>
  submitLabel: string
}

export function JobForm({ initial, onSubmit, submitLabel }: JobFormProps) {
  const [form, setForm] = useState<CreateJobRequest>(
    initial ?? { job_title: '', description: '', category: '', location: '', banner_image_url: '' },
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.job_title.trim() || !form.description.trim() || !form.location.trim() || !form.category) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Job Title *
        </label>
        <input
          name="job_title"
          required
          value={form.job_title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          required
          rows={6}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">Select...</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <ImageUpload
          type="banner"
          currentUrl={form.banner_image_url}
          onUpload={(url) => setForm((prev) => ({ ...prev, banner_image_url: url }))}
          label="Banner Image"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
