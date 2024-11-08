import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as todoController from "./bookController.js";

const app = new Hono();

app.get("/books", todoController.showForm);
app.get("/books/:id", todoController.showTodo);
app.post("/books", todoController.createTodo);
app.post("/books/:id", todoController.updateTodo);
app.post("/books/:id/delete", todoController.deleteTodo);

Deno.serve(app.fetch);