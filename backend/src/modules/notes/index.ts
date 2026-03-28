import { Elysia } from "elysia";
import { syncBodySchema } from "@notes-pwa/shared";
import { NotesService } from "./service";

export const notesRoutes = new Elysia({ prefix: "/notes" })
  .get("/", () => NotesService.list())
  .post(
    "/sync",
    async ({ body, headers }) => {
      await NotesService.sync(body.mutations);

      return {
        success: true,
        processed: body.mutations.length,
        idempotencyKey: headers["idempotency-key"],
      };
    },
    { body: syncBodySchema },
  );
