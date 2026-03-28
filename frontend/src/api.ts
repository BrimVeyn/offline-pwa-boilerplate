import { treaty } from "@elysiajs/eden";
import type { App } from "../../backend/src/index";

export const api = treaty<App>("http://localhost:3000");

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
