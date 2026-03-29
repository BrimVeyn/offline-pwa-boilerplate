import { PERMISSIONS, type Role } from '@notes-pwa/shared'
import { Elysia } from 'elysia'

import { env } from '@/env'
import { ELECTRIC_HEADERS } from '@/index'
import { authGuard } from '@/lib/auth-guard'

export const electricRoutes = new Elysia({ prefix: '/electric' })
  .use(authGuard)
  .get('/:table', async ({ params, request, set, user, status }) => {
    const perms = PERMISSIONS[user.role as Role]
    if (!perms?.readableTables.includes(params.table)) {
      return status('Forbidden', { error: 'Forbidden' })
    }

    const url = new URL(request.url)
    const targetUrl = `${env.ELECTRIC_URL}/v1/shape?table=${params.table}&${url.searchParams.toString()}`

    const response = await fetch(targetUrl, {
      headers: {
        'accept': request.headers.get('accept') ?? 'application/json',
        'if-none-match': request.headers.get('if-none-match') ?? '',
      },
    })

    set.status = response.status
    set.headers['content-type'] = response.headers.get('content-type') ?? 'application/json'
    set.headers['cache-control'] = response.headers.get('cache-control') ?? ''
    set.headers['etag'] = response.headers.get('etag') ?? ''

    for (const header of ELECTRIC_HEADERS) {
      const value = response.headers.get(header)
      if (value) set.headers[header] = value
    }

    return response.text()
  })
