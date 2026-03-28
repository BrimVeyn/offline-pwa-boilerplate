import { eq, asc } from "drizzle-orm";
import z4 from "zod/v4";
import { db } from "../../../db";
import { writers } from "../../../db/schema";
import { writerMutationDataSchema } from "@notes-pwa/shared";

type WriterData = z4.infer<typeof writerMutationDataSchema>;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export abstract class WriterEntity {
  static async list() {
    return db.select().from(writers).orderBy(asc(writers.lastName));
  }

  static async insert(tx: Tx, data: WriterData) {
    await tx
      .insert(writers)
      .values({
        id: data.id,
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .onConflictDoNothing();
  }

  static async update(tx: Tx, data: WriterData) {
    await tx
      .update(writers)
      .set({
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      })
      .where(eq(writers.id, data.id));
  }

  static async delete(tx: Tx, data: WriterData) {
    await tx.delete(writers).where(eq(writers.id, data.id));
  }
}
