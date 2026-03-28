import { useSyncExternalStore } from "react";

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
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#ef4444",
        color: "white",
        padding: "8px 20px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      You are offline — changes will sync when reconnected
    </div>
  );
}
