import { Badge } from '@/components/ui/badge'
import { useIsOnline } from '@/hooks/use-is-online'

export function OfflineIndicator() {
  const isOnline = useIsOnline()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <Badge variant="destructive" className="px-4 py-2 text-sm font-semibold shadow-lg">
        You are offline — changes will sync when reconnected
      </Badge>
    </div>
  )
}
