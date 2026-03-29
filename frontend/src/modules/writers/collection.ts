import { snakeCamelMapper } from '@electric-sql/client'
import { writerSchema } from '@notes-pwa/shared'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'

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
  })
)
