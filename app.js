import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const eta = new Eta({ views: "templates" });

const validator = z.object({
  email: z.string().email(),
  yearOfBirth: z.coerce.number().min(1900).max(2030),
});

const app = new Hono();

app.get("/", async (c) => {
  const html = await eta.render("index.eta");
  return c.html(html);
});

app.post("/emails", async (c) => {
  const body = await c.req.parseBody();
  const validationResult = validator.safeParse(body);
  if (!validationResult.success) {
    const html = await eta.render("index.eta", {
      ...body,
      error: "Not a valid email, try again.",
    });
    return c.html(html);
  }

  return c.text("Valid email, thank you!");
});

Deno.serve(app.fetch);