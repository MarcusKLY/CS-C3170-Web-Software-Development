const createCourse = async (course) => {
  course.courseId = crypto.randomUUID();

  const kv = await Deno.openKv();
  await kv.set(["courses", course.courseId], course);
};

const listCourses = async () => {
  const kv = await Deno.openKv();
  const todoEntries = await kv.list({ prefix: ["courses"] });

  const courses = [];
  for await (const entry of todoEntries) {
    courses.push(entry.value);
  }

  return courses;
};

const getCourse = async (courseId) => {
  const kv = await Deno.openKv();
  const course = await kv.get(["courses", courseId]);
  return course?.value ?? {};
};

const updateCourse = async (courseId, course) => {
  course.courseId = courseId;
  const kv = await Deno.openKv();
  await kv.set(["courses", courseId], course);
}

const deleteCourse = async (courseId) => {
		const kv = await Deno.openKv();
		await kv.delete(["courses", courseId]);
};

export { createCourse, listCourses, getCourse, updateCourse, deleteCourse };