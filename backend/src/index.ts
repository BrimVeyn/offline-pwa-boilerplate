import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { notesRoutes } from "./routes/notes";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173" }))
  .use(notesRoutes)
  .listen(3000);

console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
