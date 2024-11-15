import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as feedbacks from "./feedbacks.js";
import * as courseController from "./courseController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();

app.get("/courses/:courseId/feedbacks/:id", async (c) => {
  try {
    const id = c.req.params.id;
    const courseId = c.req.params.courseId;
    const feedbackCount = await feedbacks.getFeedbackCount(courseId, id);
    return c.text(`Feedback ${id}: ${feedbackCount}`);
  } catch (error) {
    console.error("Error in GET feedback handler:", error);
    return c.text("Internal Server Error", 500);
  }
});

app.post("/courses/:courseId/feedbacks/:id", async (c) => {
  try {
    const id = c.req.params.id;
    const courseId = c.req.params.courseId;
    await feedbacks.incrementFeedbackCount(courseId, id);
    return c.redirect(`/courses/${courseId}`);
  } catch (error) {
    console.error("Error in POST feedback handler:", error);
    return c.text("Internal Server Error", 500);
  }
});

app.get("/courses", courseController.showForm);
app.get("/courses/:courseId", courseController.showCourse);
app.post("/courses", courseController.createCourse);
app.post("/courses/:courseId", courseController.updateCourse);
app.post("/courses/:courseId/delete", courseController.deleteCourse);

export default app;