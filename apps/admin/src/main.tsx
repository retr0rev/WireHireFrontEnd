import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { AdminAuthProvider } from '@wirehire/shared'
import { Toaster } from 'react-hot-toast'
import { routeTree } from './routeTree.gen'
import './styles/app.css'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
