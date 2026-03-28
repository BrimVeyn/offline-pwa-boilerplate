import z4 from 'zod/v4'

export const writerSchema = z4.object({
  id: z4.string(),
  firstName: z4.string(),
  lastName: z4.string(),
  createdAt: z4.date(),
  updatedAt: z4.date(),
})

export type Writer = z4.infer<typeof writerSchema>
