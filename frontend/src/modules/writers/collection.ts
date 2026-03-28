import { writerSchema } from '@notes-pwa/shared'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'

import { api } from '../../lib/api'
import { queryClient } from '../notes/collection'

export const writersCollection = createCollection(
  queryCollectionOptions({
    id: 'writers',
    queryClient,
    schema: writerSchema,
    queryKey: ['writers'],
    getKey: (writer) => writer.id,
    queryFn: async () => {
      const { data, error } = await api.writers.get()
      if (error) throw error
      return data.map((writer) => ({
        ...writer,
        createdAt: new Date(writer.createdAt),
        updatedAt: new Date(writer.updatedAt),
      }))
    },
  })
)
