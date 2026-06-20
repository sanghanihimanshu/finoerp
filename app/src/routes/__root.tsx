import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import PostHogProvider from '../integrations/posthog/provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { getLocale } from '#/paraglide/runtime'
import { AppShell } from '#/components/app-shell'
import { TooltipProvider } from '#/components/ui/tooltip'
import { AuthProvider, useAuth } from '#/lib/auth'
import { NotFoundPage } from '#/components/not-found'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface MyRouterContext {
  queryClient: QueryClient
}

const PUBLIC_ROUTES = ['/login']

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'FinoERP — Construction Suite' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  notFoundComponent: () => <NotFoundPage />,
  shellComponent: RootDocument,
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

function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { location } = useRouterState()
  const isPublic = PUBLIC_ROUTES.includes(location.pathname)

  if (isPublic || !user) {
    return <AuthGuard>{children}</AuthGuard>
  }

  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <PostHogProvider>
            <TooltipProvider>
              <RootLayout>{children}</RootLayout>
            </TooltipProvider>
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
                TanStackQueryDevtools,
              ]}
            />
          </PostHogProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
