// feedbacks.js
let kv;

const getKvInstance = async () => {
  if (!kv) {
    kv = await Deno.openKv();
  }
  return kv;
};

const getFeedbackCount = async (id) => {
  const kv = await getKvInstance();
  const store = await kv.get(["feedbacks", id]);
  return store?.value ?? 0;
};

const incrementFeedbackCount = async (id) => {
  const kv = await getKvInstance();
  const count = await getFeedbackCount(id);
  await kv.set(["feedbacks", id], count + 1);
};

export { getFeedbackCount, incrementFeedbackCount };
