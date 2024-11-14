// import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
// import * as todoController from "./bookController.js";
// import	* as songController from "./songController.js";

// const app = new Hono();

// app.get("/", songController.showForm);
// app.post("/songs", songController.createSong);

// app.get("/books", todoController.showForm);
// app.get("/books/:id", todoController.showTodo);
// app.post("/books", todoController.createTodo);
// app.post("/books/:id", todoController.updateTodo);
// app.post("/books/:id/delete", todoController.deleteTodo);

// Deno.serve(app.fetch);

// -----
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as feedbacks from "./feedbacks.js";


const app = new Hono();

app.get("/", (c) => { return c.html("/templates/index.eta"); });
	

app.get("/feedbacks/:id", async (c) => {
  const id = c.req.param("id");
  const feedbackCount = await feedbacks.getFeedbackCount(id);
  return c.text(`Feedback ${id}: ${feedbackCount}`);
});

app.post("/feedbacks/:id", async (c) => {
  const id = c.req.param("id");
  await feedbacks.incrementFeedbackCount(id);
  return c.text(`OK`);
});

Deno.serve(app.fetch);