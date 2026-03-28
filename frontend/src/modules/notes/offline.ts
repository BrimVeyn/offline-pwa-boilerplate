import { startOfflineExecutor, IndexedDBAdapter } from "@tanstack/offline-transactions";
import { notesCollection } from "./collection";
import { api } from "../../api";

export const offlineExecutor = startOfflineExecutor({
  collections: { notes: notesCollection },
  storage: new IndexedDBAdapter("notes-pwa-offline", "transactions"),
  mutationFns: {
    syncNotes: async ({ transaction, idempotencyKey }) => {
      const pending = await offlineExecutor.peekOutbox();
      const isStillPending = pending.some((tx) => tx.id === transaction.id);
      if (!isStillPending) return;

      const allMutations = pending.flatMap((tx) =>
        tx.mutations.map((m) => {
          const data = (m.type === "delete" ? m.original : m.modified) as {
            id: string;
            title?: string;
            content?: string;
            createdAt?: Date;
            updatedAt?: Date;
          };
          return {
            type: m.type as "insert" | "update" | "delete",
            data: {
              id: data.id,
              title: data.title,
              content: data.content,
              createdAt: data.createdAt?.toISOString(),
              updatedAt: data.updatedAt?.toISOString(),
            },
          };
        }),
      );

      await api.notes.sync.post(
        { mutations: allMutations },
        { headers: { "idempotency-key": idempotencyKey } },
      );

      const otherIds = pending.filter((tx) => tx.id !== transaction.id).map((tx) => tx.id);
      for (const id of otherIds) {
        await offlineExecutor.removeFromOutbox(id);
      }

      await notesCollection.utils.refetch();
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
    mutationFnName: "syncNotes",
  });
  tx.mutate(mutate);
  tx.commit();
}
