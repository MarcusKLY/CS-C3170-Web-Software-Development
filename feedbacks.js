const getFeedbackCount = async (courseID, id) => {
  try {
    const kv = await Deno.openKv();
    const store = await kv.get(["feedbacks", courseID, id]);
    return store?.value ?? 0;
  } catch (error) {
    console.error("Error fetching feedback count:", error);
    throw new Error("Could not retrieve feedback count.");
  }
};

const incrementFeedbackCount = async (courseID, id) => {
  try {
    const kv = await Deno.openKv();
    const count = await getFeedbackCount(courseID, id);
    await kv.set(["feedbacks", courseID, id], count + 1);
  } catch (error) {
    console.error("Error incrementing feedback count:", error);
    throw new Error("Could not increment feedback count.");
  }
};
