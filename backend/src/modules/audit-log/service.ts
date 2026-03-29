import type { SyncModel } from '@/modules/sync/model'

import { auditLogs } from '@/db/schema'

export abstract class AuditLogService {
  static async log(
    tx: SyncModel.Tx,
    entry: {
      tableName: string
      recordId: string
      action: string
      userId: string | null
      oldData: Record<string, unknown> | null
      newData: Record<string, unknown> | null
    }
  ) {
    await tx.insert(auditLogs).values({
      id: crypto.randomUUID(),
      tableName: entry.tableName,
      recordId: entry.recordId,
      action: entry.action,
      userId: entry.userId,
      oldData: entry.oldData ? JSON.stringify(entry.oldData) : null,
      newData: entry.newData ? JSON.stringify(entry.newData) : null,
    })
  }
}
