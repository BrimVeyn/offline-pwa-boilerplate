import { tryCatch, type SyncMutation } from '@notes-pwa/shared'
import { useLogger } from 'evlog/elysia'

import { db } from '@/db'

import { NoteEntity } from './entities/notes/service'
import { WriterEntity } from './entities/writers/service'
import { SyncModel } from './model'

export abstract class SyncService {
  static async sync(mutations: SyncMutation[]) {
    const log = useLogger()

    await db.transaction(async (tx) => {
      for (const mutation of mutations) {
        log.info(`Processing: ${mutation.entity}.${mutation.type} id=${mutation.data.id}`)

        const [, error] = await tryCatch(() => this.execute(tx, mutation))

        if (error) {
          log.error(error)
          throw error
        }

        log.info(`Success: ${mutation.entity}.${mutation.type} id=${mutation.data.id}`)
      }
    })
  }

  private static execute(tx: SyncModel.Tx, m: SyncMutation) {
    switch (m.entity) {
      case 'notes':
        switch (m.type) {
          case 'insert':
            return NoteEntity.insert(tx, m.data)
          case 'update':
            return NoteEntity.update(tx, m.data)
          case 'delete':
            return NoteEntity.delete(tx, m.data)
        }
      case 'writers':
        switch (m.type) {
          case 'insert':
            return WriterEntity.insert(tx, m.data)
          case 'update':
            return WriterEntity.update(tx, m.data)
          case 'delete':
            return WriterEntity.delete(tx, m.data)
        }
    }
  }
}
