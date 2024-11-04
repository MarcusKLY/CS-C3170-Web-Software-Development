import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getStore, setStore } from "./store.js";

const app = new Hono();

app.get("/", (c) => {
  const storeParam = c.req.query("store");
  if (storeParam) {
    setStore(storeParam);
    return c.text(`Store: ${getStore()}`);
  } else {
    return c.text(`Store: ${getStore()}`);
  }
});

Deno.serve(app.fetch);