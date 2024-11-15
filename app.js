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

const getCount = (sessionId, courseId) => {
		if (!sessionCounts.has(sessionId)) {
				return 0;
		}

		const courseCounts = sessionCounts.get(sessionId);
		return courseCounts.get(courseId) ?? 0;
}

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
			await feedbacks.incrementFeedbackCount(courseId, feedbackId);
			const count = getAndIncrementCount(sessionId, courseId);
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

export { getAndIncrementCount, getCount };
export default app;