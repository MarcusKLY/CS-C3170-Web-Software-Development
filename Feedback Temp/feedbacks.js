const kv = await Deno.openKv(); // Open kv once and reuse it

// Get feedback count for a specific course and feedback value
const getFeedbackCount = async (courseId, feedbackId) => {
  try {
    const key = ["feedback", courseId, feedbackId];
    const store = await kv.get(key);
    return store?.value ?? 0;  // Default to 0 if no feedback exists
  } catch (error) {
    console.error(`Error fetching feedback count for courseId: ${courseId}, feedbackId: ${feedbackId}`, error);
    throw new Error("Could not retrieve feedback count.");
  }
};

// Increment the feedback count for a specific course and feedback value
const incrementFeedbackCount = async (courseId, feedbackId) => {
  try {
    const currentCount = await getFeedbackCount(courseId, feedbackId);
    const key = ["feedback", courseId, feedbackId];
    const newCount = currentCount + 1;

    await kv.set(key, newCount);

    console.log(`Feedback count updated for courseId: ${courseId}, feedbackId: ${feedbackId} to ${newCount}`);
  } catch (error) {
    console.error(`Error incrementing feedback count for courseId: ${courseId}, feedbackId: ${feedbackId}`, error);
    throw new Error("Could not increment feedback count.");
  }
};

export { getFeedbackCount, incrementFeedbackCount };