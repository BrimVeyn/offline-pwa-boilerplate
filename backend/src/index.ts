import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { evlog } from "evlog/elysia";
import { syncRoutes } from "./modules/sync";

const app = new Elysia()
  .use(evlog())
  .use(cors({ origin: "http://localhost:5173" }))
  .use(syncRoutes)
  .listen(3000);

console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
