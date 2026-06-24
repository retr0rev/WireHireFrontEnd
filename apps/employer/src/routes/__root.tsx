import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import type { useUnifiedAuth } from '@wirehire/shared'

interface RouterContext {
  queryClient: QueryClient
  auth: ReturnType<typeof useUnifiedAuth>
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-sm text-gray-600">
        {error instanceof Error ? error.message : 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">Page not found.</p>
      <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
        Back to dashboard
      </Link>
    </div>
  ),
})
