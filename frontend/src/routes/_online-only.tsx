import { createFileRoute, Outlet, Link } from '@tanstack/react-router'

import { useIsOnline } from '@/hooks/use-is-online'

export const Route = createFileRoute('/_online-only')({
  component: OnlineOnlyLayout,
})

function OnlineOnlyLayout() {
  const isOnline = useIsOnline()

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-muted-foreground">
          This page requires an internet connection. Please reconnect and try again.
        </p>
        <Link to="/" className="text-primary underline">
          Go back to home
        </Link>
      </div>
    )
  }

  return <Outlet />
}
