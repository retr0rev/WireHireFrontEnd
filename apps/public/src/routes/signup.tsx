import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/signup')({ component: SignupPage })

function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '', company_name: '', phone: '', company_website: '', company_bio: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading'); setErrorMsg('')
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const res = await fetch(`${baseUrl}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      setStatus('success')
    } catch (err) { setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong') }
  }

  if (status === 'success') return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="rounded-wh-card border border-wh-outline bg-wh-white p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-wh-secondary-light"><svg className="h-7 w-7 text-wh-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
        <h1 className="font-wh-headline text-2xl font-bold text-wh-primary">Account Created!</h1>
        <p className="mt-2 font-wh-body text-sm text-wh-muted">Check your email for the verification link. Once verified, an admin will review and activate your account.</p>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:py-24">
      <div className="mb-8">
        <h1 className="font-wh-headline text-3xl font-extrabold text-wh-primary">Employer Sign Up</h1>
        <p className="mt-1 font-wh-body text-wh-muted">Create an account to post jobs on WireHire</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block font-wh-mono text-xs font-medium uppercase tracking-wider text-wh-muted">Company Name</label>
          <input name="company_name" required value={form.company_name} onChange={handleChange} className="w-full rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface placeholder:text-wh-muted focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block font-wh-mono text-xs font-medium uppercase tracking-wider text-wh-muted">Email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface placeholder:text-wh-muted focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block font-wh-mono text-xs font-medium uppercase tracking-wider text-wh-muted">Password</label>
          <input name="password" type="password" required minLength={8} value={form.password} onChange={handleChange} className="w-full rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block font-wh-mono text-xs font-medium uppercase tracking-wider text-wh-muted">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface placeholder:text-wh-muted focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block font-wh-mono text-xs font-medium uppercase tracking-wider text-wh-muted">Website</label>
          <input name="company_website" value={form.company_website} onChange={handleChange} className="w-full rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface placeholder:text-wh-muted focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block font-wh-mono text-xs font-medium uppercase tracking-wider text-wh-muted">Bio</label>
          <textarea name="company_bio" rows={3} value={form.company_bio} onChange={handleChange} className="w-full rounded-[4px] border border-wh-outline bg-wh-white px-4 py-2.5 font-wh-body text-sm text-wh-onsurface placeholder:text-wh-muted focus:border-wh-secondary focus:ring-2 focus:ring-wh-secondary/20 focus:outline-none" />
        </div>
        {status === 'error' && <p className="font-wh-body text-sm text-wh-danger">{errorMsg}</p>}
        <button type="submit" disabled={status === 'loading'} className="w-full rounded-[4px] bg-wh-primary px-6 py-3 font-wh-body text-sm font-semibold text-white hover:bg-wh-primary-light disabled:opacity-50 transition-colors">
          {status === 'loading' ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}
