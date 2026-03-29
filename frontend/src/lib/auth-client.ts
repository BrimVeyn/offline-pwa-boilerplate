import { authAdditionalFields } from '@notes-pwa/shared'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  basePath: '/auth',
  plugins: [inferAdditionalFields(authAdditionalFields)],
})
