import { snakeCamelMapper } from '@electric-sql/client'
import { writerSchema, type SyncMutation } from '@notes-pwa/shared'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'

import { api } from '../../lib/api'

async function syncMutations(mutations: SyncMutation[]) {
  return api.sync.post({ mutations }).then(({ data, error }) => {
    if (error) throw error
    return { txid: data.txid }
  })
}

export const writersCollection = createCollection(
  electricCollectionOptions({
    id: 'writers',
    schema: writerSchema,
    getKey: (writer) => writer.id,
    shapeOptions: {
      url: `${window.location.origin}/api/electric/writers`,
      columnMapper: snakeCamelMapper(),
      parser: {
        timestamptz: (value: string) => new Date(value),
      },
      params: { table: 'writers' },
    },
    onInsert: async ({ transaction }) => {
      const writer = transaction.mutations[0].modified
      return syncMutations([
        {
          kind: 'writers:insert',
          data: {
            id: writer.id,
            firstName: writer.firstName,
            lastName: writer.lastName,
            createdAt: writer.createdAt.toISOString(),
            updatedAt: writer.updatedAt.toISOString(),
          },
        },
      ])
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0]
      return syncMutations([
        {
          kind: 'writers:update',
          data: {
            id: original.id,
            ...(changes.firstName !== undefined && { firstName: changes.firstName }),
            ...(changes.lastName !== undefined && { lastName: changes.lastName }),
            ...(changes.updatedAt && { updatedAt: changes.updatedAt.toISOString() }),
          },
        },
      ])
    },
    onDelete: async ({ transaction }) => {
      return syncMutations([
        {
          kind: 'writers:delete',
          data: { id: transaction.mutations[0].key as string },
        },
      ])
    },
  })
)
