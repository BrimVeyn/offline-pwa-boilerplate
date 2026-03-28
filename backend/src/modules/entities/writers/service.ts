import { eq, asc } from 'drizzle-orm'

import { db } from '@/db'
import { writers } from '@/db/schema'
import { WriterModel } from '@/modules/entities/writers/model'

export abstract class WriterEntity {
  static async list() {
    return db.select().from(writers).orderBy(asc(writers.lastName))
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
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(writers.id, data.id))
  }

  static async delete(tx: WriterModel.Tx, data: WriterModel.DeleteData) {
    await tx.delete(writers).where(eq(writers.id, data.id))
  }
}
