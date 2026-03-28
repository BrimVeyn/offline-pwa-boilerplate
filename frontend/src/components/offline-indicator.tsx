import { useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <Badge variant="destructive" className="px-4 py-2 text-sm font-semibold shadow-lg">
        You are offline — changes will sync when reconnected
      </Badge>
    </div>
  );
}
