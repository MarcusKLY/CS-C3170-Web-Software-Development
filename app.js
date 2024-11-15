import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as feedbacks from "./feedbacks.js";
import * as courseController from "./courseController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();

app.get("/courses/:courseId/feedbacks/:feedbackId", async (c) => {
  try {
    const courseId = c.params?.courseId;
    const feedbackId = c.params?.feedbackId;

    if (!courseId && !feedbackId) {
      throw new Error("Missing courseId and feedbackId");
    }

    if (!courseId || !feedbackId) {
      throw new Error("Missing courseId or feedbackId");
    }

    // Fetch the feedback count; if the key doesn't exist, it should default to 0
    const feedbackCount = await getFeedbackCount(courseId, feedbackId);
    return c.text(`Feedback ${feedbackId}: ${feedbackCount}`);
  } catch (error) {
    console.error("Error in GET feedback handler:", error);
    return c.text(`GET Internal Server Error: ${error.message}`, 500);
  }
});

app.post("/courses/:courseId/feedbacks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const courseId = c.req.param("courseId");
    await feedbacks.incrementFeedbackCount(courseId, id);
    return c.redirect(`/courses/${courseId}`);
  } catch (error) {
    console.error("Error in POST feedback handler:", error);
    return c.text(`POST Internal Server Error: ${error.message}`, 500);
  }
});

app.get("/courses", courseController.showForm);
app.get("/courses/:courseId", courseController.showCourse);
app.post("/courses", courseController.createCourse);
app.post("/courses/:courseId", courseController.updateCourse);
app.post("/courses/:courseId/delete", courseController.deleteCourse);

export default app;