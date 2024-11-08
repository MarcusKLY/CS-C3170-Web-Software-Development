import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as todoController from "./todoController.js";

const app = new Hono();

app.get("/todos", todoController.showForm);
app.get("/todos/:id", todoController.showTodo);
app.post("/todos", todoController.createTodo);

Deno.serve(app.fetch);