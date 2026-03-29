import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { evlog } from 'evlog/elysia'

import { env } from '@/env'
import { betterAuthPlugin } from '@/lib/auth-plugin'
import { electricRoutes } from '@/modules/electric'
import { syncRoutes } from '@/modules/sync'

export const ELECTRIC_HEADERS = [
  'electric-cursor',
  'electric-handle',
  'electric-offset',
  'electric-schema',
  'electric-up-to-date',
] as const

const app = new Elysia()
  .use(evlog())
  .use(
    cors({
      origin: [env.FRONTEND_URL, env.FRONTEND_PREVIEW_URL],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ELECTRIC_HEADERS as unknown as string[],
    })
  )
  .use(betterAuthPlugin)
  .group('/api', (app) => app.use(syncRoutes).use(electricRoutes))
  .listen({ port: 3000, hostname: '0.0.0.0' })

// oxlint-disable-next-line no-console
console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
