import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as courseService from "./courseService.js";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";


const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const courseSchema = z.object({
  name: z.string().min(4, "The course name should be a string of at least 4 characters."),
});

const showForm = async (c) => {
  return c.html(
    eta.render("courses.eta", { courses: await courseService.listCourses(), errors: null, course: {} }),
  );
};

const createCourse = async (c) => {
  const body = await c.req.parseBody();
  const course = {
    name: body.name,
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

    return c.html(
      eta.render("courses.eta", { courses: await courseService.listCourses(), errors, course }),
    );
  }

  await courseService.createCourse(body);
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const courseId = c.req.param("courseId");
		return c.html(
			eta.render("index.eta", { course: await courseService.getCourse(courseId) }),
		);
};

const updateCourse = async (c) => {
  const courseId = c.req.param("courseId");
  const body	= await c.req.parseBody();
		await	courseService.updateCourse(courseId, body);
		return c.redirect(`/courses/${courseId}`);
};

const deleteCourse = async (c) => {
		const courseId = c.req.param("courseId");
		await courseService.deleteCourse(courseId);
		return c.redirect("/courses");
};

export { createCourse, showForm, showCourse, updateCourse, deleteCourse };