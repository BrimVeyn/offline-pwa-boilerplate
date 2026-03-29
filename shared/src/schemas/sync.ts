import z4 from 'zod/v4'

// --- Note mutation data schemas per operation ---

export const noteInsertDataSchema = z4.object({
  id: z4.string(),
  title: z4.string(),
  content: z4.string(),
  writerId: z4.nullable(z4.string()),
  createdAt: z4.iso.datetime(),
  updatedAt: z4.iso.datetime(),
  deletedAt: z4.optional(z4.nullable(z4.iso.datetime())),
})

export const noteUpdateDataSchema = z4.object({
  id: z4.string(),
  title: z4.optional(z4.string()),
  content: z4.optional(z4.string()),
  writerId: z4.optional(z4.nullable(z4.string())),
  updatedAt: z4.optional(z4.iso.datetime()),
  deletedAt: z4.optional(z4.nullable(z4.iso.datetime())),
})

export const noteDeleteDataSchema = z4.object({
  id: z4.string(),
})

// --- Writer mutation data schemas per operation ---

export const writerInsertDataSchema = z4.object({
  id: z4.string(),
  firstName: z4.string(),
  lastName: z4.string(),
  createdAt: z4.iso.datetime(),
  updatedAt: z4.iso.datetime(),
  deletedAt: z4.optional(z4.nullable(z4.iso.datetime())),
})

export const writerUpdateDataSchema = z4.object({
  id: z4.string(),
  firstName: z4.optional(z4.string()),
  lastName: z4.optional(z4.string()),
  updatedAt: z4.optional(z4.iso.datetime()),
  deletedAt: z4.optional(z4.nullable(z4.iso.datetime())),
})

export const writerDeleteDataSchema = z4.object({
  id: z4.string(),
})

// --- Flat discriminated union on `kind` (entity:operation) ---

export const syncMutationSchema = z4.discriminatedUnion('kind', [
  z4.object({ kind: z4.literal('notes:insert'), data: noteInsertDataSchema }),
  z4.object({ kind: z4.literal('notes:update'), data: noteUpdateDataSchema }),
  z4.object({ kind: z4.literal('notes:delete'), data: noteDeleteDataSchema }),
  z4.object({ kind: z4.literal('writers:insert'), data: writerInsertDataSchema }),
  z4.object({ kind: z4.literal('writers:update'), data: writerUpdateDataSchema }),
  z4.object({ kind: z4.literal('writers:delete'), data: writerDeleteDataSchema }),
])

export type SyncMutation = z4.infer<typeof syncMutationSchema>
export type SyncMutationKind = SyncMutation['kind']

export const syncBodySchema = z4.object({
  mutations: z4.array(syncMutationSchema),
})
