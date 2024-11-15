import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

// Handle GET request to render the form or show the greeting
app.get("/", async (c) => {
  try {
    // Use `getCookie` to retrieve the value of the `name` cookie
    const name = getCookie(c.req.headers, "name");

    console.log("GET request - Name from cookie:", name);

    let responseHtml = "";
    if (name) {
      // Render greeting if `name` cookie exists
      responseHtml = await eta.render("index.eta", { name });
    } else {
      // Render the form if no `name` cookie is set
      responseHtml = await eta.render("index.eta", { name: null });
    }

    return c.html(responseHtml);
  } catch (error) {
    console.error("Error in GET request:", error);
    return c.text(`Internal Server Error1: ${error}`, 500);
  }
});

// Handle POST request to accept form data and set cookie
app.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const name = body.name;

    console.log("POST request - Received name:", name);

    if (name) {
      // Use `setCookie` to store the name in a cookie
      setCookie(c.res.headers, {
        name: "name",
        value: name,
        path: "/",
        httpOnly: true,
      });

      // Redirect to the GET request to show the greeting
      return c.redirect("/");
    } else {
      // If name is not provided, render the form with an error message
      const responseHtml = await eta.render("index.eta", { name: null, error: "Name is required" });
      return c.html(responseHtml);
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return c.text(`Internal Server Error2: ${error}`, 500);
  }
});

export default app;
