import { Elysia, t } from "elysia";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { notes } from "../db/schema";

const MutationSchema = t.Object({
  type: t.Union([
    t.Literal("insert"),
    t.Literal("update"),
    t.Literal("delete"),
  ]),
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    content: t.Optional(t.String()),
  }),
});

export const notesRoutes = new Elysia({ prefix: "/notes" })
  .get(
    "/:id",
    async ({ params, status }) => {
      const [note] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, params.id));
      if (!note) return status(404);
      return note;
    },
    { params: t.Object({ id: t.String() }) },
  )
  .get("/", async () => {
    return db.select().from(notes).orderBy(desc(notes.updatedAt));
  })
  .post(
    "/batch",
    async ({ body, headers }) => {
      const idempotencyKey = headers["idempotency-key"];

      await db.transaction(async (tx) => {
        for (const mutation of body.mutations) {
          switch (mutation.type) {
            case "insert":
              await tx
                .insert(notes)
                .values({
                  id: mutation.data.id,
                  title: mutation.data.title ?? "",
                  content: mutation.data.content ?? "",
                })
                .onConflictDoNothing();
              break;
            case "update":
              await tx
                .update(notes)
                .set({
                  ...(mutation.data.title !== undefined && {
                    title: mutation.data.title,
                  }),
                  ...(mutation.data.content !== undefined && {
                    content: mutation.data.content,
                  }),
                  updatedAt: new Date(),
                })
                .where(eq(notes.id, mutation.data.id));
              break;
            case "delete":
              await tx.delete(notes).where(eq(notes.id, mutation.data.id));
              break;
          }
        }
      });

      return {
        success: true,
        processed: body.mutations.length,
        idempotencyKey,
      };
    },
    {
      body: t.Object({
        mutations: t.Array(MutationSchema),
      }),
    },
  )
  .post(
    "/",
    async ({ body }) => {
      const [note] = await db
        .insert(notes)
        .values({ id: body.id, title: body.title, content: body.content })
        .returning();
      return note;
    },
    {
      body: t.Object({
        id: t.String(),
        title: t.String({ minLength: 1 }),
        content: t.String(),
      }),
    },
  )
  .patch(
    "/:id",
    async ({ params, body, status }) => {
      const [note] = await db
        .update(notes)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(notes.id, params.id))
        .returning();
      if (!note) return status(404);
      return note;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1 })),
        content: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const [deleted] = await db
        .delete(notes)
        .where(eq(notes.id, params.id))
        .returning({ id: notes.id });
      if (!deleted) return status(404);
      return { success: true };
    },
    { params: t.Object({ id: t.String() }) },
  );
