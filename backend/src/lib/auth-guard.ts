import { Elysia } from 'elysia'

import { auth } from '@/lib/auth'

export const authGuard = new Elysia({ name: 'auth-guard' })
  .resolve(async ({ request, status }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return status(401)
    return { user: session.user }
  })
  .as('scoped')
