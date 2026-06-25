import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/jobs')({ component: JobsLayout })

function JobsLayout() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 sm:py-16 lg:px-10">
      <Outlet />
    </main>
  )
}
