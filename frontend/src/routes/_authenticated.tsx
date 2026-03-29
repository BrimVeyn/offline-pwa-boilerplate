import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  if (!session) return <Navigate to="/login" />

  return <Outlet />
}
