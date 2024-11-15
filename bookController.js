import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as bookService from "./bookService.js";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const bookSchema = z.object({
  name: z.string().min(3, "The book name should be a string of at least 3 characters."),
  pages: z.number().min(1, "The number of pages should be a number between 1 and 1000.")
             .max(1000, "The number of pages should be a number between 1 and 1000."),
  isbn: z.string().length(13, "The ISBN should be a string of 13 characters.")
});

// Show form for adding a new book
const showForm = async (c) => {
  return c.html(
    eta.render("books.eta", { books: await bookService.listBooks(), errors: null, book: {} }),
  );
};

// Create a new book, with validation
const createBook = async (c) => {
  const body = await c.req.parseBody();
  const book = {
    name: body.name,
    pages: Number(body.pages), // Ensure pages is treated as a number
    isbn: body.isbn,
  };

  // Validate using Zod
  const validationResult = bookSchema.safeParse(book);

  if (!validationResult.success) {
    // Map the errors to match the expected structure in your template
    const errors = {};
    validationResult.error.errors.forEach((e) => {
      const field = e.path[0];
      if (!errors[field]) {
        errors[field] = { _errors: [] };
      }
      errors[field]._errors.push(e.message);
    });

    // Render the form again with validation errors and the current input values
    return c.html(
      eta.render("books.eta", { books: await bookService.listBooks(), errors, book }),
    );
  }

  // If validation passes, proceed with creating the book
  await bookService.createBook(book);
  return c.redirect("/books");
};

// Show details of a single book
const showBook = async (c) => {
  const id = c.req.param("id");
  return c.html(
    eta.render("book.eta", { book: await bookService.getBook(id) }),
  );
};

// Update an existing book
const updateBook = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  await bookService.updateBook(id, body);
  return c.redirect(`/books/${id}`);
};

// Delete a book
const deleteBook = async (c) => {
  const id = c.req.param("id");
  await bookService.deleteBook(id);
  return c.redirect("/books");
};

export { createBook, deleteBook, showForm, showBook, updateBook };
