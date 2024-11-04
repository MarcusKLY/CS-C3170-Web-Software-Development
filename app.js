import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";

const app = new Hono();

let count = 0;

app.get("/", (c) => c.text(count));

Deno.serve(app.fetch);