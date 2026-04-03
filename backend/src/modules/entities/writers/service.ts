import { eq, asc, isNull, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { notes, writers } from '@/db/schema'
import { WriterModel } from '@/modules/entities/writers/model'

const WRITER_DATA_FIELDS = ['firstName', 'lastName'] as const

export abstract class WriterEntity {
  static async list() {
    return db.select().from(writers).where(isNull(writers.deletedAt)).orderBy(asc(writers.lastName))
  }

  static async listDeleted() {
    return db
      .select()
      .from(writers)
      .where(isNotNull(writers.deletedAt))
      .orderBy(asc(writers.lastName))
  }

  static async getById(tx: WriterModel.Tx, id: string) {
    const [row] = await tx.select().from(writers).where(eq(writers.id, id))
    return row ?? null
  }

  static async insert(tx: WriterModel.Tx, data: WriterModel.InsertData) {
    const ts = data.createdAt
    await tx
      .insert(writers)
      .values({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        fieldTimestamps: {
          firstName: ts,
          lastName: ts,
        },
      })
      .onConflictDoNothing()
  }

  static async update(tx: WriterModel.Tx, data: WriterModel.UpdateData) {
    const current = await this.getById(tx, data.id)
    if (!current) return

    const clientUpdatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date()
    const clientTs = clientUpdatedAt.toISOString()
    const currentFieldTs = current.fieldTimestamps ?? {}
    const newFieldTs = { ...currentFieldTs }

    const fieldsToUpdate: Record<string, unknown> = {}

    for (const field of WRITER_DATA_FIELDS) {
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
      .update(writers)
      .set({
        ...fieldsToUpdate,
        updatedAt: newUpdatedAt,
        fieldTimestamps: newFieldTs,
      })
      .where(eq(writers.id, data.id))
  }

  static async delete(tx: WriterModel.Tx, data: WriterModel.DeleteData) {
    const current = await this.getById(tx, data.id)
    if (!current) return

    const now = new Date()
    const nowTs = now.toISOString()
    const currentFieldTs = current.fieldTimestamps ?? {}
    const storedTs = currentFieldTs['deletedAt']
      ? new Date(currentFieldTs['deletedAt'])
      : new Date(0)

    if (now <= storedTs) return

    // Cascade soft-delete: mark writer's notes as deleted too
    await tx.update(notes).set({ deletedAt: now }).where(eq(notes.writerId, data.id))
    await tx
      .update(writers)
      .set({
        deletedAt: now,
        updatedAt: now > current.updatedAt ? now : current.updatedAt,
        fieldTimestamps: { ...currentFieldTs, deletedAt: nowTs },
      })
      .where(eq(writers.id, data.id))
  }

  static async restore(tx: WriterModel.Tx, id: string) {
    // Cascade restore: restore writer and their notes that were soft-deleted
    await tx.update(writers).set({ deletedAt: null }).where(eq(writers.id, id))
    await tx.update(notes).set({ deletedAt: null }).where(eq(notes.writerId, id))
  }
}
