import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as todoService from "./todoService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = (c) => c.html(eta.render("todos.eta"));

const createTodo = async (c) => {
  const body = await c.req.parseBody();
  await todoService.createTodo(body);
  return c.redirect("/todos");
};

export { createTodo, showForm };