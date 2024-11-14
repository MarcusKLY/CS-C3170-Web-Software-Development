import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as feedbacks from "./feedbacks.js";
import { renderFile } from "https://deno.land/x/eta/mod.ts";


const app = new Hono();

app.get("/", async (c) => {
  const html = await renderFile("/templates/index.eta", {});  // Render the template
  return c.html(html);
});

app.get("/feedbacks/:id", async (c) => {
  const id = c.req.param("id");
  const feedbackCount = await feedbacks.getFeedbackCount(id);
  return c.text(`Feedback ${id}: ${feedbackCount}`);
});

app.post("/feedbacks/:id", async (c) => {
  const id = c.req.param("id");
  await feedbacks.incrementFeedbackCount(id);
  return c.text(`OK`);
});

Deno.serve(app.fetch);