import type { SyncMutationKind } from '@notes-pwa/shared'

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'
import { setAllowedMutationKinds } from '@/lib/permissions'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session.data) throw redirect({ to: '/login' })

    const raw = session.data.session.allowedMutationKinds
    const kinds: SyncMutationKind[] = raw ? JSON.parse(raw) : []
    setAllowedMutationKinds(kinds)

    return { session: session.data }
  },
  component: () => <Outlet />,
})
