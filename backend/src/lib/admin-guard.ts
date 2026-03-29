import type { Role } from '@notes-pwa/shared'

import { Elysia } from 'elysia'

import { authGuard } from '@/lib/auth-guard'

export const adminGuard = new Elysia({ name: 'admin-guard' })
  .use(authGuard)
  .resolve(({ user, status }) => {
    if ((user.role as Role) !== 'admin') return status('Forbidden')
    return {}
  })
  .as('scoped')
