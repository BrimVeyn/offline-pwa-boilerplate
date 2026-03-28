import { eq, desc } from 'drizzle-orm'

import { db } from '@/db'
import { notes } from '@/db/schema'

import { NoteModel } from './model'

export abstract class NoteEntity {
  static async list() {
    return db.select().from(notes).orderBy(desc(notes.updatedAt))
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
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(notes.id, data.id))
  }

  static async delete(tx: NoteModel.Tx, data: NoteModel.DeleteData) {
    await tx.delete(notes).where(eq(notes.id, data.id))
  }
}
