const kv = await Deno.openKv(); // Open kv once and reuse it

const getFeedbackCount = async (courseId, id) => {
  try {
    const store = await kv.get(["feedbacks", courseId, id]);
    return store?.value ?? 0;
  } catch (error) {
    console.error("Error fetching feedback count:", error);
    throw new Error("Could not retrieve feedback count.");
  }
};

const incrementFeedbackCount = async (courseId, id) => {
  try {
    const count = await getFeedbackCount(courseId, id);
    await kv.set(["feedbacks", courseId, id], count + 1);
  } catch (error) {
    console.error(`Error incrementing feedback count for courseId: ${courseId}, id: ${id}`, error);
    throw new Error("Could not increment feedback count.");
  }
};

