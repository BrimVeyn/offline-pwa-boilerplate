import { eq, asc, isNull, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { notes, writers } from '@/db/schema'
import { WriterModel } from '@/modules/entities/writers/model'

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
    await tx
      .insert(writers)
      .values({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      })
      .onConflictDoNothing()
  }

  static async update(tx: WriterModel.Tx, data: WriterModel.UpdateData) {
    await tx
      .update(writers)
      .set({
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.deletedAt !== undefined && {
          deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
        }),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(writers.id, data.id))
  }

  static async delete(tx: WriterModel.Tx, data: WriterModel.DeleteData) {
    const now = new Date()
    // Cascade soft-delete: mark writer's notes as deleted too
    await tx.update(notes).set({ deletedAt: now }).where(eq(notes.writerId, data.id))
    await tx.update(writers).set({ deletedAt: now }).where(eq(writers.id, data.id))
  }

  static async restore(tx: WriterModel.Tx, id: string) {
    // Cascade restore: restore writer and their notes that were soft-deleted
    await tx.update(writers).set({ deletedAt: null }).where(eq(writers.id, id))
    await tx.update(notes).set({ deletedAt: null }).where(eq(notes.writerId, id))
  }
}
