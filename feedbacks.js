const getFeedbackCount = async (courseID, id) => {
  const kv = await Deno.openKv();
  const store = await kv.get(["feedbacks", courseID, id]);
  return store?.value ?? 0;
};

const incrementFeedbackCount = async (courseID, id) => {
  const kv = await Deno.openKv();
  const count = await getFeedbackCount(courseID, id);
  await kv.set(["feedbacks", courseID, id], count + 1);
};

export { getFeedbackCount, incrementFeedbackCount };