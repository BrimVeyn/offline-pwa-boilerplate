import { FetchError, snakeCamelMapper } from '@electric-sql/client'
import { writerSchema } from '@notes-pwa/shared'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'

export const deletedWritersCollection = createCollection(
  electricCollectionOptions({
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
    id: 'deleted-writers',
    schema: writerSchema,
    getKey: (writer) => writer.id,
    shapeOptions: {
      onError: (error) => {
        if (error instanceof FetchError && error.status === 403) {
          return
        }
      },
      url: `${window.location.origin}/api/electric/writers?deleted=true`,
      columnMapper: snakeCamelMapper(),
      parser: {
        timestamptz: (value: string) => new Date(value),
      },
      params: { table: 'writers' },
    },
  })
)
