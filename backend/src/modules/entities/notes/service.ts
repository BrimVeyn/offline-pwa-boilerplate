import { eq, desc, isNull, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { notes } from '@/db/schema'
import { NoteModel } from '@/modules/entities/notes/model'

export abstract class NoteEntity {
  static async list() {
    return db.select().from(notes).where(isNull(notes.deletedAt)).orderBy(desc(notes.updatedAt))
  }

  static async listDeleted() {
    return db.select().from(notes).where(isNotNull(notes.deletedAt)).orderBy(desc(notes.deletedAt))
  }

  static async getById(tx: NoteModel.Tx, id: string) {
    const [row] = await tx.select().from(notes).where(eq(notes.id, id))
    return row ?? null
  }

  static async insert(tx: NoteModel.Tx, data: NoteModel.InsertData) {
    await tx
      .insert(notes)
      .values({
        id: data.id,
        title: data.title,
        content: data.content,
        writerId: data.writerId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      })
      .onConflictDoNothing()
  }

  static async update(tx: NoteModel.Tx, data: NoteModel.UpdateData) {
    await tx
      .update(notes)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.writerId !== undefined && { writerId: data.writerId }),
        ...(data.deletedAt !== undefined && {
          deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
        }),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(notes.id, data.id))
  }

  static async delete(tx: NoteModel.Tx, data: NoteModel.DeleteData) {
    await tx.update(notes).set({ deletedAt: new Date() }).where(eq(notes.id, data.id))
  }

  static async restore(tx: NoteModel.Tx, id: string) {
    await tx.update(notes).set({ deletedAt: null }).where(eq(notes.id, id))
  }
}
