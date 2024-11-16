import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import {
  getSignedCookie,
  setSignedCookie,
} from "https://deno.land/x/hono@v3.12.11/helper.ts";
import * as courseService from "./courseService.js";
import * as feedbacks from "./feedbacks.js";


const userCourseFeedbacks = new Map();
const secret = "secret";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const setAndGetSessionId = async (c) => {
  const sessionId = await getSignedCookie(c, secret, "sessionId") ??
    crypto.randomUUID();
  await setSignedCookie(c, "sessionId", sessionId, secret, {
    path: "/",
  });

  return sessionId;
};

const hasGivenFeedback = async (userId, courseId) => {
  return userCourseFeedbacks.has(userId) &&
    userCourseFeedbacks.get(userId).has(courseId);
};

const setHasGivenFeedback = async (userId, courseId) => {
  if (!userCourseFeedbacks.has(userId)) {
    userCourseFeedbacks.set(userId, new Set());
  }

  userCourseFeedbacks.get(userId).add(courseId);
};

const showForm = async (c) => {
  await setAndGetSessionId(c);
  return c.html(
    eta.render("courses.eta", { courses: await courseService.listCourses() }),
  );
};

const createCourse = async (c) => {
  await setAndGetSessionId(c);

  const body = await c.req.parseBody();
  await courseService.createCourse(body);
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const userId = await setAndGetSessionId(c);

  const id = c.req.param("id");
  return c.html(
    eta.render("course.eta", {
      course: await courseService.getCourse(id),
      feedbackAlreadyGiven: await hasGivenFeedback(userId, id),
    }),
  );
};

const deleteCourse = async (c) => {
  await setAndGetSessionId(c);

  const id = c.req.param("id");
  await courseService.deleteCourse(id);
  return c.redirect("/courses");
};

const giveFeedback = async (c) => {
  const userId = await setAndGetSessionId(c);
  const courseId = c.req.param("courseId");

  if (await hasGivenFeedback(userId, courseId)) {
    // has already given feedback
    return c.redirect(`/courses/${courseId}`);
  }

  await setHasGivenFeedback(userId, courseId);

  const feedbackId = c.req.param("feedbackId");
  await feedbacks.incrementFeedbackCount(courseId, feedbackId);
  return c.redirect(`/courses/${courseId}`);
};

const getFeedbackCount = async (c) => {
  const courseId = c.req.param("courseId");
  const feedbackId = c.req.param("feedbackId");
  const feedbackCount = await feedbacks.getFeedbackCount(courseId, feedbackId);
  return c.text(`Feedback ${feedbackId}: ${feedbackCount}`);
};

export {
  createCourse,
  deleteCourse,
  getFeedbackCount,
  giveFeedback,
  showCourse,
  showForm,
};