import type { SyncMutation } from "@notes-pwa/shared";
import { useLogger } from "evlog/elysia";
import { db } from "../../db";
import { NoteEntity } from "./entities/notes";
import { WriterEntity } from "./entities/writers";

export abstract class SyncService {
  static async sync(mutations: SyncMutation[]) {
    const log = useLogger();

    await db.transaction(async (tx) => {
      for (const mutation of mutations) {
        log.info(`Processing: ${mutation.entity}.${mutation.type} id=${mutation.data.id}`);
        log.set({ currentMutation: mutation });

        try {
          switch (mutation.entity) {
            case "notes":
              switch (mutation.type) {
                case "insert":
                  await NoteEntity.insert(tx, mutation.data);
                  break;
                case "update":
                  await NoteEntity.update(tx, mutation.data);
                  break;
                case "delete":
                  await NoteEntity.delete(tx, mutation.data);
                  break;
              }
              break;
            case "writers":
              switch (mutation.type) {
                case "insert":
                  await WriterEntity.insert(tx, mutation.data);
                  break;
                case "update":
                  await WriterEntity.update(tx, mutation.data);
                  break;
                case "delete":
                  await WriterEntity.delete(tx, mutation.data);
                  break;
              }
              break;
          }
          log.info(`Success: ${mutation.entity}.${mutation.type} id=${mutation.data.id}`);
        } catch (err) {
          log.error(err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      }
    });
  }
}
