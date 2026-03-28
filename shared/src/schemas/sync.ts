import z4 from "zod/v4";

const mutationType = z4.union([z4.literal("insert"), z4.literal("update"), z4.literal("delete")]);

export const noteMutationDataSchema = z4.object({
  id: z4.string(),
  title: z4.optional(z4.string()),
  content: z4.optional(z4.string()),
  writerId: z4.optional(z4.nullable(z4.string())),
  createdAt: z4.optional(z4.iso.datetime()),
  updatedAt: z4.optional(z4.iso.datetime()),
});

export const writerMutationDataSchema = z4.object({
  id: z4.string(),
  firstName: z4.optional(z4.string()),
  lastName: z4.optional(z4.string()),
  createdAt: z4.optional(z4.iso.datetime()),
  updatedAt: z4.optional(z4.iso.datetime()),
});

export const syncMutationSchema = z4.discriminatedUnion("entity", [
  z4.object({
    entity: z4.literal("notes"),
    type: mutationType,
    data: noteMutationDataSchema,
  }),
  z4.object({
    entity: z4.literal("writers"),
    type: mutationType,
    data: writerMutationDataSchema,
  }),
]);

export type SyncMutation = z4.infer<typeof syncMutationSchema>;

export const syncBodySchema = z4.object({
  mutations: z4.array(syncMutationSchema),
});
