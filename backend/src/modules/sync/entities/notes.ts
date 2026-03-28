import { eq, desc } from "drizzle-orm";
import z4 from "zod/v4";
import { db } from "../../../db";
import { notes } from "../../../db/schema";
import { noteMutationDataSchema } from "@notes-pwa/shared";

type NoteData = z4.infer<typeof noteMutationDataSchema>;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export abstract class NoteEntity {
  static async list() {
    return db.select().from(notes).orderBy(desc(notes.updatedAt));
  }

  static async insert(tx: Tx, data: NoteData) {
    await tx
      .insert(notes)
      .values({
        id: data.id,
        title: data.title ?? "",
        content: data.content ?? "",
        writerId: data.writerId ?? null,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .onConflictDoNothing();
  }

  static async update(tx: Tx, data: NoteData) {
    await tx
      .update(notes)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.writerId !== undefined && { writerId: data.writerId }),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(notes.id, data.id));
  }

  static async delete(tx: Tx, data: NoteData) {
    await tx.delete(notes).where(eq(notes.id, data.id));
  }
}
