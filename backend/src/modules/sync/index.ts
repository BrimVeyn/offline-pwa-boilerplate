import { Elysia } from "elysia";
import { syncBodySchema } from "@notes-pwa/shared";
import { SyncService } from "./service";
import { NoteEntity } from "./entities/notes";
import { WriterEntity } from "./entities/writers";

export const syncRoutes = new Elysia()
  .get("/notes", () => NoteEntity.list())
  .get("/writers", () => WriterEntity.list())
  .post(
    "/sync",
    async ({ body, headers, log }) => {
      log.info(`Sync request: ${body.mutations.length} mutations`);
      log.set({ mutations: body.mutations });

      await SyncService.sync(body.mutations);

      return {
        success: true,
        processed: body.mutations.length,
        idempotencyKey: headers["idempotency-key"],
      };
    },
    { body: syncBodySchema },
  );
