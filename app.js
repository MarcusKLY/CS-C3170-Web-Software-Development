import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import {
  getCookie,
  setCookie,
} from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

// Middleware to use Eta for rendering templates
app.use("*", async (c, next) => {
  c.set("render", async (template, data = {}) => {
    const result = await eta.render(template, data);
    c.header("Content-Type", "text/html");
    c.res.body = result;
  });
  await next();
});

// GET /
app.get("/", async (c) => {
  const name = getCookie(c.req.headers, "name");
  if (name) {
    // Show greeting if name exists
    return c.render("index", { name });
  }
  // Show form otherwise
  return c.render("index", { name: null });
});

// POST /
app.post("/", async (c) => {
  const formData = await c.req.parseBody();
  const name = formData.name;

  if (name) {
    // Store the name in a cookie
    setCookie(c.res.headers, {
      name: "name",
      value: name,
      path: "/",
      httpOnly: true,
    });
  }

  // Redirect back to GET /
  return c.redirect("/");
});

export default app;
