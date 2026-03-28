import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import {
  startOfflineExecutor,
  IndexedDBAdapter,
} from "@tanstack/offline-transactions";
import { QueryClient } from "@tanstack/react-query";
import z4 from "zod/v4";
import { api } from "../api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});

const noteSchema = z4.object({
  id: z4.string(),
  title: z4.string(),
  content: z4.string(),
  createdAt: z4.date(),
  updatedAt: z4.date(),
});

export const notesCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    schema: noteSchema,
    queryKey: ["notes"],
    getKey: (note) => note.id,
    queryFn: async () => {
      const { data, error } = await api.notes.get();
      if (error) throw error;
      return data.map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    },
    onInsert: async ({ transaction }) => {
      const { modified: newNote } = transaction.mutations[0];
      await api.notes.post(newNote);
    },
    onUpdate: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        const original = mutation.original as { id: string };
        const changes = mutation.changes as {
          title?: string;
          content?: string;
        };
        await api.notes({ id: original.id }).patch(changes);
      }
    },
    onDelete: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        const original = mutation.original as { id: string };
        await api.notes({ id: original.id }).delete();
      }
    },
  }),
);

// --- Offline executor ---
export const offlineExecutor = startOfflineExecutor({
  collections: { notes: notesCollection },
  storage: new IndexedDBAdapter("notes-pwa-offline", "transactions"),
  mutationFns: {
    syncNotes: async ({ transaction, idempotencyKey }) => {
      const mutations = transaction.mutations.map((m) => {
        const data = (m.type === "delete" ? m.original : m.modified) as {
          id: string;
          title?: string;
          content?: string;
        };
        return {
          type: m.type as "insert" | "update" | "delete",
          data: { id: data.id, title: data.title, content: data.content },
        };
      });

      await api.notes.batch.post(
        { mutations },
        { headers: { "idempotency-key": idempotencyKey } },
      );

      await notesCollection.utils.refetch();
    },
  },
  onLeadershipChange: (isLeader) => {
    if (!isLeader) {
      console.warn("Running in online-only mode (another tab is the leader)");
    }
  },
});

// --- Offline mutation helpers ---
// Each creates a transaction, mutates the collection inside it, and commits.
// The executor persists to IDB before network — nothing is lost.

export function addNote(note: { id: string; title: string; content: string }) {
  const tx = offlineExecutor.createOfflineTransaction({
    mutationFnName: "syncNotes",
  });
  tx.mutate(() => {
    notesCollection.insert({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

export function updateNote(vars: {
  id: string;
  title: string;
  content: string;
}) {
  const tx = offlineExecutor.createOfflineTransaction({
    mutationFnName: "syncNotes",
  });
  tx.mutate(() => {
    notesCollection.update(vars.id, (draft) => {
      draft.title = vars.title;
      draft.content = vars.content;
      draft.updatedAt = new Date();
    });
  });
}

export function deleteNote(vars: { id: string }) {
  const tx = offlineExecutor.createOfflineTransaction({
    mutationFnName: "syncNotes",
  });
  tx.mutate(() => {
    notesCollection.delete(vars.id);
  });
}
