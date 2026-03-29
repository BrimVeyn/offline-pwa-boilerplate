import { FetchError, snakeCamelMapper } from '@electric-sql/client'
import { auditLogSchema } from '@notes-pwa/shared'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'

export const auditLogsCollection = createCollection(
  electricCollectionOptions({
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
    id: 'audit-logs',
    schema: auditLogSchema,
    getKey: (log) => log.id,
    shapeOptions: {
      onError: (error) => {
        if (error instanceof FetchError && error.status === 403) {
          return
        }
      },
      url: `${window.location.origin}/api/electric/audit_logs`,
      columnMapper: snakeCamelMapper(),
      parser: {
        timestamptz: (value: string) => new Date(value),
      },
      params: { table: 'audit_logs' },
    },
  })
)
