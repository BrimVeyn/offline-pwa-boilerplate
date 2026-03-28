import { startOfflineExecutor, IndexedDBAdapter } from "@tanstack/offline-transactions";
import { notesCollection } from "./modules/notes/collection";
import { writersCollection } from "./modules/writers/collection";
import { api } from "./api";

const ENTITY_MAP: Record<string, "notes" | "writers"> = {
  notes: "notes",
  writers: "writers",
};

export const offlineExecutor = startOfflineExecutor({
  collections: { notes: notesCollection, writers: writersCollection },
  storage: new IndexedDBAdapter("notes-pwa-offline", "transactions"),
  mutationFns: {
    sync: async ({ transaction, idempotencyKey }) => {
      const pending = await offlineExecutor.peekOutbox();
      const isStillPending = pending.some((tx) => tx.id === transaction.id);
      if (!isStillPending) return;

      const allMutations = pending.flatMap((tx) =>
        tx.mutations.map((m) => {
          const entity = ENTITY_MAP[m.collection?.id ?? ""];
          const data = (m.type === "delete" ? m.original : m.modified) as Record<string, unknown>;

          if (entity === "notes") {
            return {
              entity: "notes" as const,
              type: m.type as "insert" | "update" | "delete",
              data: {
                id: data.id as string,
                title: data.title as string | undefined,
                content: data.content as string | undefined,
                writerId: data.writerId as string | null | undefined,
                createdAt: (data.createdAt as Date)?.toISOString(),
                updatedAt: (data.updatedAt as Date)?.toISOString(),
              },
            };
          }

          return {
            entity: "writers" as const,
            type: m.type as "insert" | "update" | "delete",
            data: {
              id: data.id as string,
              firstName: data.firstName as string | undefined,
              lastName: data.lastName as string | undefined,
              createdAt: (data.createdAt as Date)?.toISOString(),
              updatedAt: (data.updatedAt as Date)?.toISOString(),
            },
          };
        }),
      );

      await api.sync.post(
        { mutations: allMutations },
        { headers: { "idempotency-key": idempotencyKey } },
      );

      const otherIds = pending.filter((tx) => tx.id !== transaction.id).map((tx) => tx.id);
      for (const id of otherIds) {
        await offlineExecutor.removeFromOutbox(id);
      }

      await Promise.all([notesCollection.utils.refetch(), writersCollection.utils.refetch()]);
    },
  },
  onLeadershipChange: (isLeader) => {
    if (!isLeader) {
      console.warn("Running in online-only mode (another tab is the leader)");
    }
  },
});

export function executeMutation(mutate: () => void) {
  const tx = offlineExecutor.createOfflineTransaction({
    mutationFnName: "sync",
    autoCommit: false,
  });
  tx.mutate(mutate);
  tx.commit();
}
