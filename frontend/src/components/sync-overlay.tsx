import { Loader2 } from 'lucide-react'

import { useIsSyncing } from '@/hooks/use-is-syncing'

export function SyncOverlay() {
  const isSyncing = useIsSyncing()

  if (!isSyncing) return null

  return (
    <div className="bg-background/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-foreground size-10 animate-spin" />
        <p className="text-foreground text-lg font-medium">
          Synchronisation en cours
          <AnimatedDots />
        </p>
      </div>
    </div>
  )
}

function AnimatedDots() {
  return <span className="animate-dots" />
}
