import { syncMutationSchema, type SyncMutationKind } from '@notes-pwa/shared'
import {
  IndexedDBAdapter,
  NonRetriableError,
  startOfflineExecutor,
} from '@tanstack/offline-transactions'

import { notesCollection } from '../modules/notes/collection'
import { writersCollection } from '../modules/writers/collection'
import { api } from './api'

export const offlineExecutor = startOfflineExecutor({
  collections: { notes: notesCollection, writers: writersCollection },
  storage: new IndexedDBAdapter('notes-pwa-offline', 'transactions'),
  mutationFns: {
    sync: async ({ transaction, idempotencyKey }) => {
      const mutations = transaction.mutations.flatMap((m) => {
        const kind = `${m.collection.id}:${m.type}` as SyncMutationKind
        const raw = (m.type === 'delete' ? m.original : m.modified) as Record<string, unknown>

        const serialized = Object.fromEntries(
          Object.entries(raw).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v])
        )

        const { data, error } = syncMutationSchema.safeParse({ kind, data: serialized })
        if (error) {
          // oxlint-disable-next-line no-console
          console.warn(`Invalid mutation ${kind}:`, error.message)
          return []
        }
        return [data]
      })

      if (mutations.length === 0) {
        throw new NonRetriableError('All mutations in transaction failed validation')
      }

      const response = await api.sync.post(
        { mutations },
        { headers: { 'idempotency-key': idempotencyKey } }
      )

      if (response.status === 403) {
        throw new NonRetriableError(`Forbidden: ${JSON.stringify(response.data)}`)
      }

      if (response.error) {
        throw new Error(`Sync failed: ${response.status}`)
      }
    },
  },
  onLeadershipChange: (isLeader) => {
    if (!isLeader) {
      //TODO: sync external store -> block site access
    }
  },
})

export function executeMutation(mutate: () => void) {
  const tx = offlineExecutor.createOfflineTransaction({
    mutationFnName: 'sync',
    autoCommit: false,
  })
  tx.mutate(mutate)
  tx.commit()
}
