import { eq, desc, isNull, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { notes } from '@/db/schema'
import { NoteModel } from '@/modules/entities/notes/model'

const NOTE_DATA_FIELDS = ['title', 'content', 'writerId'] as const

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
    const ts = data.createdAt
    await tx
      .insert(notes)
      .values({
        id: data.id,
        title: data.title,
        content: data.content,
        writerId: data.writerId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        fieldTimestamps: {
          title: ts,
          content: ts,
          writerId: ts,
        },
      })
      .onConflictDoNothing()
  }

  static async update(tx: NoteModel.Tx, data: NoteModel.UpdateData) {
    const current = await this.getById(tx, data.id)
    if (!current) return

    const clientUpdatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date()
    const clientTs = clientUpdatedAt.toISOString()
    const currentFieldTs = current.fieldTimestamps ?? {}
    const newFieldTs = { ...currentFieldTs }

    const fieldsToUpdate: Record<string, unknown> = {}

    for (const field of NOTE_DATA_FIELDS) {
      if (data[field] === undefined) continue
      const storedTs = currentFieldTs[field] ? new Date(currentFieldTs[field]) : new Date(0)
      if (clientUpdatedAt > storedTs) {
        fieldsToUpdate[field] = data[field]
        newFieldTs[field] = clientTs
      }
    }

    if (data.deletedAt !== undefined) {
      const storedTs = currentFieldTs['deletedAt']
        ? new Date(currentFieldTs['deletedAt'])
        : new Date(0)
      if (clientUpdatedAt > storedTs) {
        fieldsToUpdate['deletedAt'] = data.deletedAt ? new Date(data.deletedAt) : null
        newFieldTs['deletedAt'] = clientTs
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) return

    const newUpdatedAt = clientUpdatedAt > current.updatedAt ? clientUpdatedAt : current.updatedAt

    await tx
      .update(notes)
      .set({
        ...fieldsToUpdate,
        updatedAt: newUpdatedAt,
        fieldTimestamps: newFieldTs,
      })
      .where(eq(notes.id, data.id))
  }

  static async delete(tx: NoteModel.Tx, data: NoteModel.DeleteData) {
    const current = await this.getById(tx, data.id)
    if (!current) return

    const now = new Date()
    const nowTs = now.toISOString()
    const currentFieldTs = current.fieldTimestamps ?? {}
    const storedTs = currentFieldTs['deletedAt']
      ? new Date(currentFieldTs['deletedAt'])
      : new Date(0)

    if (now <= storedTs) return

    await tx
      .update(notes)
      .set({
        deletedAt: now,
        updatedAt: now > current.updatedAt ? now : current.updatedAt,
        fieldTimestamps: { ...currentFieldTs, deletedAt: nowTs },
      })
      .where(eq(notes.id, data.id))
  }

  static async restore(tx: NoteModel.Tx, id: string) {
    await tx.update(notes).set({ deletedAt: null }).where(eq(notes.id, id))
  }
}
