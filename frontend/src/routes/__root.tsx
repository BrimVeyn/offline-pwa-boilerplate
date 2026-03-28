import { useEffect, useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { queryClient } from "../modules/notes/collection";
import { offlineExecutor } from "../modules/notes/offline";
import { OfflineIndicator } from "../components/offline-indicator";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    offlineExecutor.waitForInit().then(() => setReady(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "24px 16px",
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {ready ? <Outlet /> : null}
      </div>
      <OfflineIndicator />
      <TanStackDevtools
        plugins={[
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: true,
          },
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  );
}
