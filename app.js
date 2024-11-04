import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as countService from "./countService.js";

const app = new Hono();

app.get("/", (c) => c.text(countService.getCount()));

app.post("/", (c) => {
  countService.incrementCount();
  return c.text(countService.getCount());
});

Deno.serve(app.fetch);