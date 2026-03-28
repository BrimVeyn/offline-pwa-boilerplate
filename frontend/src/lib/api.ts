import type { App } from '@../../../backend/src/index'

import { treaty } from '@elysiajs/eden'

export const api = treaty<App>(
  `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
).api
