import { snakeCamelMapper } from '@electric-sql/client'
import { noteSchema } from '@notes-pwa/shared'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'

export const notesCollection = createCollection(
  electricCollectionOptions({
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
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
  })
)
