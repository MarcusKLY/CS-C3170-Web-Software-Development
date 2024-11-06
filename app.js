import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { addSong, getSongs } from "./songService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();

app.get("/", async (c) => {
  const songs = getSongs();
  return c.html(await eta.render("index.eta", { songs }));
});

app.post("/songs", async (c) => {
  const { name, duration } = await c.req.parseBody();
  addSong(name, parseInt(duration, 10));
  return c.redirect("/");
});

Deno.serve(app.fetch);
