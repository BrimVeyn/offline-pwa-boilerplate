import z4 from 'zod/v4'

const envSchema = z4.object({
  DATABASE_URL: z4.url(),
  BETTER_AUTH_URL: z4.url(),
  ELECTRIC_URL: z4.url().default('http://localhost:3001'),
  FRONTEND_URL: z4.url(),
  FRONTEND_PREVIEW_URL: z4.url(),
})

export const env = envSchema.parse(process.env)
