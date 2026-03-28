import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { QueryClient } from "@tanstack/react-query";
import { noteSchema } from "@notes-pwa/shared";
import { api } from "../../api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});

export const notesCollection = createCollection(
  queryCollectionOptions({
    id: "notes",
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
  }),
);
