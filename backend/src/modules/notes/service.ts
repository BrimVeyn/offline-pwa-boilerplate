import { eq, desc } from "drizzle-orm";
import z4 from "zod/v4";
import { db } from "../../db";
import { notes } from "../../db/schema";
import { mutationSchema } from "@notes-pwa/shared";

type Mutation = z4.infer<typeof mutationSchema>;

export abstract class NotesService {
  static async list() {
    return db.select().from(notes).orderBy(desc(notes.updatedAt));
  }

  static async sync(mutations: Mutation[]) {
    await db.transaction(async (tx) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case "insert":
            await tx
              .insert(notes)
              .values({
                id: mutation.data.id,
                title: mutation.data.title ?? "",
                content: mutation.data.content ?? "",
                createdAt: mutation.data.createdAt ? new Date(mutation.data.createdAt) : new Date(),
                updatedAt: mutation.data.updatedAt ? new Date(mutation.data.updatedAt) : new Date(),
              })
              .onConflictDoNothing();
            break;
          case "update":
            await tx
              .update(notes)
              .set({
                ...(mutation.data.title !== undefined && {
                  title: mutation.data.title,
                }),
                ...(mutation.data.content !== undefined && {
                  content: mutation.data.content,
                }),
                updatedAt: mutation.data.updatedAt ? new Date(mutation.data.updatedAt) : new Date(),
              })
              .where(eq(notes.id, mutation.data.id));
            break;
          case "delete":
            await tx.delete(notes).where(eq(notes.id, mutation.data.id));
            break;
        }
      }
    });
  }
}
