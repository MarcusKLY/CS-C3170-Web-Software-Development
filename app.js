import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";

const app = new Hono();

let count = 3;

app.get("/", (c) => {
  if (count === 0) {
    return c.text("Kaboom!");
  } else {
    const temp = count;
    count--;
    return c.text(temp.toString());
  }
});

export default app;
