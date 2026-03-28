import { syncBodySchema } from '@notes-pwa/shared'
import { Elysia } from 'elysia'
import { evlog } from 'evlog/elysia'

import { NoteEntity } from '@/modules/entities/notes/service'
import { WriterEntity } from '@/modules/entities/writers/service'

import { SyncService } from './service'

export const syncRoutes = new Elysia()
  .use(evlog())
  .get('/notes', () => NoteEntity.list())
  .get('/writers', () => WriterEntity.list())
  .post(
    '/sync',
    async ({ body, headers, log }) => {
      log.info(`Sync request: ${body.mutations.length} mutations`)
      log.set(Object.fromEntries(body.mutations.map((m, i) => [`mutation-${i}`, m])))

      await SyncService.sync(body.mutations)

      return {
        success: true,
        processed: body.mutations.length,
        idempotencyKey: headers['idempotency-key'],
      }
    },
    { body: syncBodySchema }
  )
