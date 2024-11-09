import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as todoService from "./bookService.js";
import * as songService from "./songService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("books.eta", { books: await todoService.listTodos() }),
  );
};

const createTodo = async (c) => {
  const body = await c.req.parseBody();
  await todoService.createTodo(body);
  return c.redirect("/books");
};

const showTodo = async (c) => {
  const id = c.req.param("id");
		return c.html(
			eta.render("book.eta", { book: await todoService.getTodo(id) }),
		);
};

const updateTodo = async (c) => {
  const id = c.req.param("id");
  const body	= await c.req.parseBody();
		await	todoService.updateTodo(id, body);
		return c.redirect(`/books/${id}`);
};

const deleteTodo = async (c) => {
		const id = c.req.param("id");
		await todoService.deleteTodo(id);
		return c.redirect("/books");
};

export { createTodo, showForm, showTodo, updateTodo, deleteTodo };