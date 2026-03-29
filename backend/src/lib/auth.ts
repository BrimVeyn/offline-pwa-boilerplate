import { authAdditionalFields, PERMISSIONS, type Role } from '@notes-pwa/shared'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { user as userTable } from '@/db/auth-schema'
import { env } from '@/env'

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: [env.FRONTEND_URL, env.FRONTEND_PREVIEW_URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
  },
  user: {
    additionalFields: authAdditionalFields.user,
  },
  session: {
    additionalFields: authAdditionalFields.session,
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [user] = await db
            .select({ role: userTable.role })
            .from(userTable)
            .where(eq(userTable.id, session.userId))
          const perms = PERMISSIONS[(user?.role as Role) ?? 'viewer']
          return {
            data: {
              ...session,
              allowedMutationKinds: JSON.stringify(perms.allowedMutationKinds),
            },
          }
        },
      },
    },
  },
  experimental: {
    joins: true,
  },
})
