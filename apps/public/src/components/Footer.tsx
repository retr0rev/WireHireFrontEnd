export function Footer() {
  return (
    <footer className="border-t border-wh-outline bg-wh-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 lg:px-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="WireHire" className="h-6 w-6" />
            <span className="font-wh-headline text-sm font-bold text-wh-primary">WireHire</span>
          </div>
          <p className="font-wh-body text-xs text-wh-muted">
            &copy; {new Date().getFullYear()} WireHire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
