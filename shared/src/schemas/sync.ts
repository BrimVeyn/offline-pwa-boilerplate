import z4 from 'zod/v4'

// --- Note mutation data schemas per operation ---

export const noteInsertDataSchema = z4.object({
  id: z4.string(),
  title: z4.string(),
  content: z4.string(),
  writerId: z4.nullable(z4.string()),
  createdAt: z4.iso.datetime(),
  updatedAt: z4.iso.datetime(),
})

export const noteUpdateDataSchema = z4.object({
  id: z4.string(),
  title: z4.optional(z4.string()),
  content: z4.optional(z4.string()),
  writerId: z4.optional(z4.nullable(z4.string())),
  updatedAt: z4.optional(z4.iso.datetime()),
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
})

export const writerUpdateDataSchema = z4.object({
  id: z4.string(),
  firstName: z4.optional(z4.string()),
  lastName: z4.optional(z4.string()),
  updatedAt: z4.optional(z4.iso.datetime()),
})

export const writerDeleteDataSchema = z4.object({
  id: z4.string(),
})

// --- Nested discriminated unions: entity > type ---

const noteMutationSchema = z4.discriminatedUnion('type', [
  z4.object({
    entity: z4.literal('notes'),
    type: z4.literal('insert'),
    data: noteInsertDataSchema,
  }),
  z4.object({
    entity: z4.literal('notes'),
    type: z4.literal('update'),
    data: noteUpdateDataSchema,
  }),
  z4.object({
    entity: z4.literal('notes'),
    type: z4.literal('delete'),
    data: noteDeleteDataSchema,
  }),
])

const writerMutationSchema = z4.discriminatedUnion('type', [
  z4.object({
    entity: z4.literal('writers'),
    type: z4.literal('insert'),
    data: writerInsertDataSchema,
  }),
  z4.object({
    entity: z4.literal('writers'),
    type: z4.literal('update'),
    data: writerUpdateDataSchema,
  }),
  z4.object({
    entity: z4.literal('writers'),
    type: z4.literal('delete'),
    data: writerDeleteDataSchema,
  }),
])

export const syncMutationSchema = z4.discriminatedUnion('entity', [
  ...noteMutationSchema.options,
  ...writerMutationSchema.options,
])

export type SyncMutation = z4.infer<typeof syncMutationSchema>

export const syncBodySchema = z4.object({
  mutations: z4.array(syncMutationSchema),
})
