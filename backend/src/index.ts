import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { evlog } from 'evlog/elysia'

import { syncRoutes } from '@/modules/sync'

const app = new Elysia({ prefix: '/api' })
  .use(evlog())
  .use(cors({ origin: true }))
  .use(syncRoutes)
  .listen({ port: 3000, hostname: '0.0.0.0' })

// oxlint-disable-next-line no-console
console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
