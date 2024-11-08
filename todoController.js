import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as todoService from "./todoService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("todos.eta", { todos: await todoService.listTodos() }),
  );
};

const createTodo = async (c) => {
  const body = await c.req.parseBody();
  await todoService.createTodo(body);
  return c.redirect("/todos");
};

const showTodo = async (c) => {
		const id = c.req.param("id");
		return c.text("Asking for a todo with id " + id);
}

export { createTodo, showForm, showTodo };