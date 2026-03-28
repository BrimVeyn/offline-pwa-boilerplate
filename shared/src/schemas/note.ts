import z4 from "zod/v4";

export const noteSchema = z4.object({
  id: z4.string(),
  title: z4.string(),
  content: z4.string(),
  createdAt: z4.date(),
  updatedAt: z4.date(),
});

export type Note = z4.infer<typeof noteSchema>;

export const mutationSchema = z4.object({
  type: z4.union([
    z4.literal("insert"),
    z4.literal("update"),
    z4.literal("delete"),
  ]),
  data: z4.object({
    id: z4.string(),
    title: z4.optional(z4.string()),
    content: z4.optional(z4.string()),
  }),
});

export const syncBodySchema = z4.object({
  mutations: z4.array(mutationSchema),
});
