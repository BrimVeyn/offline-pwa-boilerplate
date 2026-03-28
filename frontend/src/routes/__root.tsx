import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'

import { OfflineIndicator } from '../components/offline-indicator'
import { offlineExecutor } from '../lib/offline'
import { queryClient } from '../modules/notes/collection'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    offlineExecutor.waitForInit().then(() => setReady(true))
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-screen max-w-2xl px-4 py-6">{ready ? <Outlet /> : null}</div>
      <OfflineIndicator />
      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: true,
          },
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  )
}
