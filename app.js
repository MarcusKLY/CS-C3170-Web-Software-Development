import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

// Handle GET request to render the form or show the greeting
app.get('/', (c) => {
  const name = getCookie(c.req, 'name'); // Get the cookie value for 'name'

  if (name) {
    // If name cookie is present, render greeting instead of form
    return c.html(eta.render('index.eta', { name }));
  } else {
    // Render the form if the cookie is not set
    return c.html(eta.render('index.eta', { name: null }));
  }
});

// Handle POST request to accept form data and set cookie
app.post('/', async (c) => {
  const body = await c.req.parseBody();
  const name = body.name;

  if (name) {
    // Set the cookie with the name value
    setCookie(c, {
      name: 'name',
      value: name,
      path: '/',
      httpOnly: true,
    });

    // Redirect to the GET request to render the greeting
    return c.redirect('/');
  } else {
    // If name is not provided, render the form again with an error message
    return c.html(eta.render('index.eta', { name: null, error: "Name is required" }));
  }
});

export default app;
