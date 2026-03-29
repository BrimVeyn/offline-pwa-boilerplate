import { Elysia } from 'elysia'

import { db } from '@/db'
import { adminGuard } from '@/lib/admin-guard'
import { AuditLogService } from '@/modules/audit-log/service'
import { NoteEntity } from '@/modules/entities/notes/service'
import { WriterEntity } from '@/modules/entities/writers/service'

export const trashRoutes = new Elysia({ prefix: '/trash' })
  .use(adminGuard)
  .post('/notes/:id/restore', async ({ params, user }) => {
    await db.transaction(async (tx) => {
      const oldData = await NoteEntity.getById(tx, params.id)
      await NoteEntity.restore(tx, params.id)
      const newData = await NoteEntity.getById(tx, params.id)
      await AuditLogService.log(tx, {
        tableName: 'notes',
        recordId: params.id,
        action: 'restore',
        userId: user.id,
        oldData: oldData as Record<string, unknown> | null,
        newData: newData as Record<string, unknown> | null,
      })
    })
    return { success: true }
  })
  .post('/writers/:id/restore', async ({ params, user }) => {
    await db.transaction(async (tx) => {
      const oldWriter = await WriterEntity.getById(tx, params.id)
      await WriterEntity.restore(tx, params.id)
      const newWriter = await WriterEntity.getById(tx, params.id)
      await AuditLogService.log(tx, {
        tableName: 'writers',
        recordId: params.id,
        action: 'restore',
        userId: user.id,
        oldData: oldWriter as Record<string, unknown> | null,
        newData: newWriter as Record<string, unknown> | null,
      })
    })
    return { success: true }
  })
