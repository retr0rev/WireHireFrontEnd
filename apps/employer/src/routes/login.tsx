import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useUnifiedAuth } from '@wirehire/shared'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { login, user, admin, isLoading } = useUnifiedAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already authenticated on mount (refresh with valid cookie), redirect.
  // We skip the isLoading check here — if user/admin is set, we're authenticated
  // regardless of whether the initial probe finished. The probe might still be
  // running (waiting for 401s) while we already have a valid session from login().
  useEffect(() => {
    if (user) window.location.href = '/'
    else if (admin) window.location.href = '/admin'
  }, [user, admin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { role } = await login(email, password)
      // Full page redirect via window.location — bypasses router context staleness.
      window.location.href = role === 'admin' ? '/admin' : '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
