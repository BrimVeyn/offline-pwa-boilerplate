import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  if (session) return <Navigate to="/" />

  return <Outlet />
}
