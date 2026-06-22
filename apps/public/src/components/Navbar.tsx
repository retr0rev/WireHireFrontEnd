import { Link } from '@tanstack/react-router'

export function Navbar() {
  return (
    <header className="border-b border-wh-outline bg-wh-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="WireHire" className="h-10 w-10" />
          <span className="font-wh-headline text-xl font-extrabold tracking-tight text-wh-primary">
            WireHire
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/jobs" className="font-wh-body text-sm font-medium text-wh-muted hover:text-wh-primary transition-colors">
            Browse Jobs
          </Link>
          <Link to="/employers" className="font-wh-body text-sm font-medium text-wh-muted hover:text-wh-primary transition-colors">
            Employers
          </Link>
          <Link to="/signup" className="rounded-[4px] bg-wh-primary px-5 py-2.5 font-wh-body text-sm font-semibold text-white hover:bg-wh-primary-light transition-colors">
            Post a Job
          </Link>
        </nav>
      </div>
    </header>
  )
}
