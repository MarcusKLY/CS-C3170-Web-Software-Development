import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("index.eta"),
  );
};

const getFeedbackCount = async (id) => {
  const kv = await Deno.openKv();
  const store = await kv.get(["feedbacks", id]);
  return store?.value ?? 0;
};

const incrementFeedbackCount = async (id) => {
  const kv = await Deno.openKv();
  const count = await getFeedbackCount(id);
  await kv.set(["feedbacks", id], count + 1);
};



export { getFeedbackCount, incrementFeedbackCount, showForm };