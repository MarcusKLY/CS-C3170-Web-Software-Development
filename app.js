import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as feedbacks from "./feedbacks.js";
import * as courseController from "./courseController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();

app.get("/courses/:courseId/feedbacks/:id", async (c) => {
  const id = c.req.param("id");
  const feedbackCount = await feedbacks.getFeedbackCount(id);
  return c.text(`Feedback ${id}: ${feedbackCount}`);
});

app.post("/courses/:courseId/feedbacks/:id", async (c) => {
  const id = c.req.param("id");
  await feedbacks.incrementFeedbackCount(id);
  return c.redirect("/");
});

app.get("/courses", courseController.showForm);
app.get("/courses/:courseId", courseController.showCourse);
app.post("/courses", courseController.createCourse);
app.post("/courses/:courseId", courseController.updateCourse);
app.post("/courses/:courseId/delete", courseController.deleteCourse);

export default app;