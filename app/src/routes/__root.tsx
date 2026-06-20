import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import PostHogProvider from '../integrations/posthog/provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { AppShell } from '#/components/app-shell'
import { TooltipProvider } from '#/components/ui/tooltip'
import { AuthProvider, useAuth } from '#/lib/auth'
import { NotFoundPage } from '#/components/not-found'
import { useEffect } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import '../styles.css'

interface MyRouterContext {
  queryClient: QueryClient
}

const PUBLIC_ROUTES = ['/login']

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => <NotFoundPage />,
  component: RootComponent,
})

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { location } = useRouterState()
  const isPublic = PUBLIC_ROUTES.includes(location.pathname)

  useEffect(() => {
    if (!user && !isPublic) {
      navigate({ to: '/login' })
    }
  }, [user, isPublic, navigate])

  if (!user && !isPublic) return null
  return <>{children}</>
}

function AppContent() {
  const { user } = useAuth()
  const { location } = useRouterState()
  const isPublic = PUBLIC_ROUTES.includes(location.pathname)

  if (isPublic || !user) {
    return (
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthGuard>
  )
}

function RootComponent() {
  return (
    <AuthProvider>
      <PostHogProvider>
        <TooltipProvider>
          <AppContent />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
              TanStackQueryDevtools,
            ]}
          />
        </TooltipProvider>
      </PostHogProvider>
    </AuthProvider>
  )
}
