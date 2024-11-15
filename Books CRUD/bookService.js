const createTodo = async (book) => {
  book.id = crypto.randomUUID();

  const kv = await Deno.openKv();
  await kv.set(["books", book.id], book);
};

const listTodos = async () => {
  const kv = await Deno.openKv();
  const todoEntries = await kv.list({ prefix: ["books"] });

  const books = [];
  for await (const entry of todoEntries) {
    books.push(entry.value);
  }

  return books;
};

const getTodo = async (id) => {
  const kv = await Deno.openKv();
  const book = await kv.get(["books", id]);
  return book?.value ?? {};
};

const updateTodo = async (id, book) => {
  book.id = id;
  const kv = await Deno.openKv();
  await kv.set(["books", id], book);
}

const deleteTodo = async (id) => {
		const kv = await Deno.openKv();
		await kv.delete(["books", id]);
};

export { createTodo, listTodos, getTodo, updateTodo, deleteTodo };