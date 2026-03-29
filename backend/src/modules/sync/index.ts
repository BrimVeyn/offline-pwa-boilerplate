import { PERMISSIONS, syncBodySchema, type Role } from '@notes-pwa/shared'
import { Elysia } from 'elysia'
import { evlog } from 'evlog/elysia'

import { authGuard } from '@/lib/auth-guard'
import { NoteEntity } from '@/modules/entities/notes/service'
import { WriterEntity } from '@/modules/entities/writers/service'
import { SyncService } from '@/modules/sync/service'

export const syncRoutes = new Elysia()
  .use(evlog())
  .use(authGuard)
  .get('/notes', () => NoteEntity.list())
  .get('/writers', () => WriterEntity.list())
  .post(
    '/sync',
    async ({ body, headers, log, user, set }) => {
      const perms = PERMISSIONS[user.role as Role]
      const unauthorized = body.mutations.filter(
        (m) => !perms.allowedMutationKinds.includes(m.kind)
      )
      if (unauthorized.length > 0) {
        set.status = 403
        return {
          error: 'Forbidden',
          unauthorizedKinds: [...new Set(unauthorized.map((m) => m.kind))],
        }
      }

      log.info(`Sync request: ${body.mutations.length} mutations`)
      log.set(Object.fromEntries(body.mutations.map((m, i) => [`mutation-${i}`, m])))

      const txid = await SyncService.sync(body.mutations)

      return {
        success: true,
        processed: body.mutations.length,
        idempotencyKey: headers['idempotency-key'],
        txid,
      }
    },
    { body: syncBodySchema }
  )
