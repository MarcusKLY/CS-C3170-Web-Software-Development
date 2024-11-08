const createTodo = async (todo) => {
  todo.id = crypto.randomUUID();

  const kv = await Deno.openKv();
  await kv.set(["todos", todo.id], todo);
};

export { createTodo };