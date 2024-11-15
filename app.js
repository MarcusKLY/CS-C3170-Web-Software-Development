import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import {   getSignedCookie,
  setSignedCookie,getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

import * as feedbacks from "./feedbacks.js";
import * as courseController from "./courseController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();
const sessionCounts = new Map();
const secret = "secret";

const getAndIncrementCount = (sessionId, courseId) => {
  if (!sessionCounts.has(sessionId)) {
    sessionCounts.set(sessionId, new Map());
  }

  const courseCounts = sessionCounts.get(sessionId);
  let count = courseCounts.get(courseId) ?? 0;
  count++;
  courseCounts.set(courseId, count);

  return count;
};

app.get("/courses/:courseId/feedbacks/:feedbackId", async (c) => {
  const courseId = c.req.param("courseId");
  const feedbackId = c.req.param("feedbackId");
  const feedbackCount = await feedbacks.getFeedbackCount(courseId, feedbackId);
  return c.text(`Feedback ${feedbackId}: ${feedbackCount}`);
});

app.post("/courses/:courseId/feedbacks/:feedbackId", async (c) => {
  try {
			const sessionId = await getSignedCookie(c, secret, "sessionId") ??
    	crypto.randomUUID();
			await setSignedCookie(c, "sessionId", sessionId, secret, {
			path: "/",
  	});
			const courseId = c.req.param("courseId");
			const feedbackId = c.req.param("feedbackId");
			const count = getAndIncrementCount(sessionId, courseId);
			await feedbacks.incrementFeedbackCount(courseId, feedbackId);
			return c.redirect(`/courses/${courseId}`, {count});
  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Error: ${error}`, 500);
  }
});



app.get("/courses", courseController.showForm);
app.get("/courses/:id", courseController.showCourse);
app.post("/courses", courseController.createCourse);
app.post("/courses/:id/delete", courseController.deleteCourse);

export { getAndIncrementCount };
export default app;