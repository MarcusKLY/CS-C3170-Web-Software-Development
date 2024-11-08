const createTodo = async (todo) => {
  todo.id = crypto.randomUUID();

  const kv = await Deno.openKv();
  await kv.set(["todos", todo.id], todo);
};

const listTodos = async () => {
  const kv = await Deno.openKv();
  const todoEntries = await kv.list({ prefix: ["todos"] });

  const todos = [];
  for await (const entry of todoEntries) {
    todos.push(entry.value);
  }

  return todos;
};

export { createTodo, listTodos };