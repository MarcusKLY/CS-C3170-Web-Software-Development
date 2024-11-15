import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

// Handle GET request to render the form or show the greeting
app.get('/', async (c) => {
  try {
    const name = getCookie(c.req, 'name'); // Get the cookie value for 'name'

    console.log("GET request - Name from cookie:", name);

    if (name) {
      // If name cookie is present, render greeting instead of form
      return c.html(await eta.render('index.eta', { name }));
    } else {
      // Render the form if the cookie is not set
      return c.html(await eta.render('index.eta', { name: null }));
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return c.text(`Internal Server Error1 ${error}`, 500);	
  }
});

// Handle POST request to accept form data and set cookie
app.post('/', async (c) => {
  try {
    const body = await c.req.parseBody();
    const name = body.name;

    console.log("POST request - Received name:", name);

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
      return c.html(await eta.render('index.eta', { name: null, error: "Name is required" }));
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return c.text(`Internal Server Error2 ${error}`, 500);	
  }
});

export default app;
