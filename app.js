import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as courseController from "./courseController.js";

const app = new Hono();

app.get(
  "/courses/:courseId/feedbacks/:feedbackId",
  courseController.getFeedbackCount,
);
app.post(
  "/courses/:courseId/feedbacks/:feedbackId",
  courseController.giveFeedback,
);

app.get("/courses", courseController.showForm);
app.get("/courses/:id", courseController.showCourse);
app.post("/courses", courseController.createCourse);
app.post("/courses/:id/delete", courseController.deleteCourse);

export default app;