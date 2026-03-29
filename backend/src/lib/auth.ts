import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/db'

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: [process.env.FRONTEND_URL!, process.env.FRONTEND_PREVIEW_URL!],
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
  },
  experimental: {
    joins: true,
  },
})
