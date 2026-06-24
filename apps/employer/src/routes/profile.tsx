import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useEmployerAuth, apiFetch, API_PATHS } from '@wirehire/shared'
import type { Client } from '@wirehire/shared'
import { AuthLayout } from '../components/AuthLayout'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
  beforeLoad: ({ context, location }) => {
    void location
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
})

function ProfilePage() {
  const { user } = useEmployerAuth()
  const [form, setForm] = useState({
    company_name: user?.company_name ?? '',
    company_website: user?.company_website ?? '',
    company_logo_url: user?.company_logo_url ?? '',
    company_bio: user?.company_bio ?? '',
    phone_number: user?.phone_number ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await apiFetch<Client>(API_PATHS.authMe, {
        method: 'PATCH',
        body: JSON.stringify({
          company_name: form.company_name,
          company_website: form.company_website,
          company_logo_url: form.company_logo_url,
          company_bio: form.company_bio,
          phone: form.phone_number,
        }),
      })
      setMessage('Profile updated!')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Company Profile</h1>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Website</label>
            <input
              name="company_website"
              value={form.company_website}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Logo URL</label>
            <input
              name="company_logo_url"
              value={form.company_logo_url}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="company_bio"
              rows={4}
              value={form.company_bio}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          {message && (
            <p
              className={`text-sm ${message === 'Profile updated!' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
