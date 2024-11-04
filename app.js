import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";

const app = new Hono();

let count = 3;

app.get("/", (c) => {
  count--;
		if (count === 0) {
			c.text("Kaboom!");
			return;
		} });

Deno.serve(app.fetch);