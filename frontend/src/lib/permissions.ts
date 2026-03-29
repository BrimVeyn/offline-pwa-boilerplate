import type { SyncMutationKind } from '@notes-pwa/shared'

import { toast } from 'sonner'

let allowedMutationKinds: SyncMutationKind[] = []

export function setAllowedMutationKinds(kinds: SyncMutationKind[]) {
  allowedMutationKinds = kinds
}

export function isAllowed(kind: SyncMutationKind): boolean {
  return allowedMutationKinds.includes(kind)
}

export function assertAllowed(kind: SyncMutationKind): void {
  if (!isAllowed(kind)) {
    toast.error(`You don't have permission to perform this action (${kind})`)
    throw new Error(`Forbidden: ${kind}`)
  }
}
