import z4 from 'zod/v4'

export const auditLogSchema = z4.object({
  id: z4.string(),
  tableName: z4.string(),
  recordId: z4.string(),
  action: z4.string(),
  userId: z4.nullable(z4.string()),
  oldData: z4.nullable(z4.string()),
  newData: z4.nullable(z4.string()),
  createdAt: z4.date(),
})

export type AuditLog = z4.infer<typeof auditLogSchema>
