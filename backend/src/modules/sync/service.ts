import { tryCatch, type SyncMutation } from '@notes-pwa/shared'
import { sql } from 'drizzle-orm'
import { useLogger } from 'evlog/elysia'

import type { SyncModel } from '@/modules/sync/model'

import { db } from '@/db'
import { AuditLogService } from '@/modules/audit-log/service'
import { NoteEntity } from '@/modules/entities/notes/service'
import { WriterEntity } from '@/modules/entities/writers/service'

function getTableAndAction(kind: string) {
  const [tableName, action] = kind.split(':') as [string, string]
  return { tableName, action }
}

async function getRecord(tx: SyncModel.Tx, tableName: string, recordId: string) {
  if (tableName === 'notes') return NoteEntity.getById(tx, recordId)
  if (tableName === 'writers') return WriterEntity.getById(tx, recordId)
  return null
}

export abstract class SyncService {
  static async sync(mutations: SyncMutation[], userId: string) {
    const log = useLogger()

    return await db.transaction(async (tx) => {
      for (const mutation of mutations) {
        log.info(`Processing: ${mutation.kind} id=${mutation.data.id}`)

        const { tableName, action } = getTableAndAction(mutation.kind)
        const oldData =
          action !== 'insert' ? await getRecord(tx, tableName, mutation.data.id) : null

        const [, error] = await tryCatch(() => this.execute(tx, mutation))

        if (error) {
          log.error(error)
          throw error
        }

        const newData =
          action !== 'delete' ? await getRecord(tx, tableName, mutation.data.id) : null

        await AuditLogService.log(tx, {
          tableName,
          recordId: mutation.data.id,
          action,
          userId,
          oldData: oldData as Record<string, unknown> | null,
          newData: newData as Record<string, unknown> | null,
        })

        log.info(`Success: ${mutation.kind} id=${mutation.data.id}`)
      }

      const [row] = await tx.execute<{ txid: string }>(
        sql`SELECT pg_current_xact_id()::text AS txid`
      )
      return parseInt(row.txid, 10)
    })
  }

  private static execute(tx: SyncModel.Tx, m: SyncMutation) {
    switch (m.kind) {
      case 'notes:insert':
        return NoteEntity.insert(tx, m.data)
      case 'notes:update':
        return NoteEntity.update(tx, m.data)
      case 'notes:delete':
        return NoteEntity.delete(tx, m.data)
      case 'writers:insert':
        return WriterEntity.insert(tx, m.data)
      case 'writers:update':
        return WriterEntity.update(tx, m.data)
      case 'writers:delete':
        return WriterEntity.delete(tx, m.data)
    }
  }
}
