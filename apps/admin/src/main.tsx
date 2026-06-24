import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { AdminAuthProvider, useAdminAuth } from '@wirehire/shared'
import { Toaster } from 'react-hot-toast'
import { routeTree } from './routeTree.gen'
import './styles/app.css'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined as unknown as ReturnType<typeof useAdminAuth>,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

function App() {
  const auth = useAdminAuth()
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} context={{ auth }} />
    </>
  )
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
