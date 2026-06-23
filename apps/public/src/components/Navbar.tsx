import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-wh-outline bg-wh-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/logo.svg" alt="WireHire" className="h-10 w-10" />
          <span className="font-wh-headline text-xl font-extrabold tracking-tight text-wh-primary">
            WireHire
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/jobs" className="font-wh-body text-sm font-medium text-wh-muted hover:text-wh-primary transition-colors">
            Browse Jobs
          </Link>
          <Link to="/employers" className="font-wh-body text-sm font-medium text-wh-muted hover:text-wh-primary transition-colors">
            Employers
          </Link>
          <a
            href={`${import.meta.env.VITE_EMPLOYER_URL ?? ''}/login`}
            className="font-wh-body text-sm font-medium text-wh-muted hover:text-wh-primary transition-colors"
          >
            Login
          </a>
          <Link to="/signup" className="rounded-[4px] bg-wh-primary px-5 py-2.5 font-wh-body text-sm font-semibold text-white hover:bg-wh-primary-light transition-colors">
            Post a Job
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-wh-outline text-wh-primary md:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-wh-outline bg-wh-white md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-3">
            <Link to="/jobs" onClick={() => setOpen(false)} className="rounded-[4px] px-3 py-2.5 font-wh-body text-sm font-medium text-wh-onsurface hover:bg-wh-surface">
              Browse Jobs
            </Link>
            <Link to="/employers" onClick={() => setOpen(false)} className="rounded-[4px] px-3 py-2.5 font-wh-body text-sm font-medium text-wh-onsurface hover:bg-wh-surface">
              Employers
            </Link>
            <a
              href={`${import.meta.env.VITE_EMPLOYER_URL ?? ''}/login`}
              className="rounded-[4px] px-3 py-2.5 font-wh-body text-sm font-medium text-wh-onsurface hover:bg-wh-surface"
            >
              Login
            </a>
            <Link to="/signup" onClick={() => setOpen(false)} className="mt-1 rounded-[4px] bg-wh-primary px-3 py-2.5 text-center font-wh-body text-sm font-semibold text-white hover:bg-wh-primary-light">
              Post a Job
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
