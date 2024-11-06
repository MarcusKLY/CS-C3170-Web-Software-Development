import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const app = new Hono();

app.get("/", (c) => {
  return c.html(eta.render("index.eta"));
});

app.post("/songs", async (c) => {
    const name = await c.req.param("name");
    const duration = await c.req.param("duration");
    addSong(name, parseInt(duration, 10));
    return c.redirect("/");
});


// export default app;
Deno.serve(app.fetch);
