import { syncMutationSchema, type SyncMutationKind } from '@notes-pwa/shared'
import { IndexedDBAdapter, startOfflineExecutor } from '@tanstack/offline-transactions'

import { notesCollection } from '../modules/notes/collection'
import { writersCollection } from '../modules/writers/collection'
import { api } from './api'

export const offlineExecutor = startOfflineExecutor({
  collections: { notes: notesCollection, writers: writersCollection },
  storage: new IndexedDBAdapter('notes-pwa-offline', 'transactions'),
  mutationFns: {
    sync: async ({ transaction, idempotencyKey }) => {
      const pending = await offlineExecutor.peekOutbox()
      const isStillPending = pending.some((tx) => tx.id === transaction.id)
      if (!isStillPending) return

      const allMutations = pending.flatMap((tx) =>
        tx.mutations.flatMap((m) => {
          const kind = `${m.collection.id}:${m.type}` as SyncMutationKind
          const raw = (m.type === 'delete' ? m.original : m.modified) as Record<string, unknown>

          // Serialize Date objects to ISO strings for schema validation
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
      )

      await api.sync.post(
        { mutations: allMutations },
        { headers: { 'idempotency-key': idempotencyKey } }
      )

      const otherIds = pending.filter((tx) => tx.id !== transaction.id).map((tx) => tx.id)
      for (const id of otherIds) {
        await offlineExecutor.removeFromOutbox(id)
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
