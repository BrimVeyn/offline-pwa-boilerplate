import { tryCatch, type SyncMutation } from '@notes-pwa/shared'
import { useLogger } from 'evlog/elysia'

import { db } from '@/db'
import { NoteEntity } from '@/modules/entities/notes/service'
import { WriterEntity } from '@/modules/entities/writers/service'

import type { SyncModel } from './model'

export abstract class SyncService {
  static async sync(mutations: SyncMutation[]) {
    const log = useLogger()

    await db.transaction(async (tx) => {
      for (const mutation of mutations) {
        log.info(`Processing: ${mutation.kind} id=${mutation.data.id}`)

        const [, error] = await tryCatch(() => this.execute(tx, mutation))

        if (error) {
          log.error(error)
          throw error
        }

        log.info(`Success: ${mutation.kind} id=${mutation.data.id}`)
      }
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
