import z4 from 'zod/v4'

export const noteSchema = z4.object({
  id: z4.string(),
  title: z4.string(),
  content: z4.string(),
  writerId: z4.nullable(z4.string()),
  createdAt: z4.date(),
  updatedAt: z4.date(),
  deletedAt: z4.nullable(z4.date()),
})

export type Note = z4.infer<typeof noteSchema>
