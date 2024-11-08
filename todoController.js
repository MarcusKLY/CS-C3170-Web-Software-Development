import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = (c) => c.html(eta.render("todos.eta"));

const createTodo = async (c) => {
  const body = await c.req.parseBody();
  console.log(body);
  return c.redirect("/todos");
};

export { showForm, createTodo };