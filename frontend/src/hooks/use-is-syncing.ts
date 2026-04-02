import { useSyncExternalStore } from 'react'

import { offlineExecutor } from '@/lib/offline'

function subscribe(callback: () => void) {
  const interval = setInterval(callback, 200)
  return () => clearInterval(interval)
}

function getSnapshot() {
  return offlineExecutor.getPendingCount() > 0 && offlineExecutor.getRunningCount() > 0
}

export function useIsSyncing() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
