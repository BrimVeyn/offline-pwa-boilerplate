import type { SyncMutationKind } from './schemas/sync'

export const ROLES = ['admin', 'editor', 'viewer'] as const
export type Role = (typeof ROLES)[number]

export const PERMISSIONS: Record<
  Role,
  {
    readableTables: string[]
    allowedMutationKinds: SyncMutationKind[]
  }
> = {
  admin: {
    readableTables: ['notes', 'writers'],
    allowedMutationKinds: [
      'notes:insert',
      'notes:update',
      'notes:delete',
      'writers:insert',
      'writers:update',
      'writers:delete',
    ],
  },
  editor: {
    readableTables: ['notes', 'writers'],
    allowedMutationKinds: ['notes:insert', 'notes:update', 'notes:delete'],
  },
  viewer: {
    readableTables: ['notes'],
    allowedMutationKinds: [],
  },
}
