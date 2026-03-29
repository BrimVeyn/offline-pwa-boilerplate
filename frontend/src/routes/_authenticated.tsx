import type { SyncMutationKind } from '@notes-pwa/shared'

import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'

import { authClient } from '@/lib/auth-client'
import { setAllowedMutationKinds } from '@/lib/permissions'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!session) return
    const raw = (session.session as Record<string, unknown>).allowedMutationKinds
    const kinds: SyncMutationKind[] = typeof raw === 'string' ? JSON.parse(raw) : []
    setAllowedMutationKinds(kinds)
  }, [session])

  if (isPending) return null

  if (!session) return <Navigate to="/login" />

  return <Outlet />
}
