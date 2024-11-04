import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { setStore, getStore } from "./store.js";

const app = new Hono();

app.get("/", (c) => {
  const newStoreValue = c.req.query("store");
  if (newStoreValue !== null) {
    setStore(newStoreValue);
  }
  return c.text(`Store: ${getStore()}`);
});

// export default app;
Deno.serve(app.fetch);
