import { snakeCamelMapper } from '@electric-sql/client'
import { noteSchema, type SyncMutation } from '@notes-pwa/shared'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
})

async function syncMutations(mutations: SyncMutation[]) {
  return api.sync.post({ mutations }).then(({ data, error }) => {
    if (error) throw error
    return { txid: data.txid }
  })
}

export const notesCollection = createCollection(
  electricCollectionOptions({
    id: 'notes',
    schema: noteSchema,
    getKey: (note) => note.id,
    shapeOptions: {
      url: `${window.location.origin}/api/electric/notes`,
      columnMapper: snakeCamelMapper(),
      parser: {
        timestamptz: (value: string) => new Date(value),
      },
      params: { table: 'notes' },
    },
    onInsert: async ({ transaction }) => {
      const note = transaction.mutations[0].modified
      return syncMutations([
        {
          kind: 'notes:insert',
          data: {
            id: note.id,
            title: note.title,
            content: note.content,
            writerId: note.writerId,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
          },
        },
      ])
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0]
      return syncMutations([
        {
          kind: 'notes:update',
          data: {
            id: original.id,
            ...(changes.title !== undefined && { title: changes.title }),
            ...(changes.content !== undefined && { content: changes.content }),
            ...(changes.writerId !== undefined && { writerId: changes.writerId }),
            ...(changes.updatedAt && { updatedAt: changes.updatedAt.toISOString() }),
          },
        },
      ])
    },
    onDelete: async ({ transaction }) => {
      return syncMutations([
        {
          kind: 'notes:delete',
          data: { id: transaction.mutations[0].key as string },
        },
      ])
    },
  })
)
