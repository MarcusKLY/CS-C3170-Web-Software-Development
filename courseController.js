import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

import * as courseService from "./courseService.js";

const nameError = "The course name should be a string of at least 4 characters.";
const courseValidator = z.object({
  name: z.string({ message: nameError }).min(4, { message: nameError }),
});

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("courses.eta", { courses: await courseService.listCourses() }),
  );
};

const createCourse = async (c) => {
  const body = await c.req.parseBody();
  const course = {
    name: body.name || "",  // Ensure the name is set or defaults to an empty string
  };

  const validationResult = courseSchema.safeParse(course);

  if (!validationResult.success) {
    const errors = {};
    validationResult.error.errors.forEach((e) => {
      const field = e.path[0];
      if (!errors[field]) {
        errors[field] = { _errors: [] };
      }
      errors[field]._errors.push(e.message);
    });

    // Render the form again with validation errors and user's input value retained
    return c.html(
      eta.render("courses.eta", { courses, errors, course }) // Make sure we are passing the course object containing user's input
    );
  }

  // If validation succeeds
  await courseService.createCourse(course);
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const id = c.req.param("id");
  return c.html(
    eta.render("course.eta", { course: await courseService.getCourse(id) }),
  );
};

const deleteCourse = async (c) => {
  const id = c.req.param("id");
  await courseService.deleteCourse(id);
  return c.redirect("/courses");
};

export { createCourse, deleteCourse, showCourse, showForm };