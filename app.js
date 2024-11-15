import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

app.get("/", async (c) => {
  try {
    // Retrieve the cookie value using getCookie
    const name = getCookie(c.req.header("cookie"), "name");

    // Render the template based on whether the name is in the cookie
    return c.html(await eta.render("index.eta", { rname: name }));

  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Error: ${error}`, 500);
  }
});

app.post("/", async (c) => {
  try {
    // Parse the form data from the request
    const formData = await c.req.parseBody();
    const name = formData?.name;

    if (!name) {
      return c.text("Name is required", 400);
    }

    // Set the cookie value using setCookie
    setCookie(c, "name", name, { path: "/", maxAge: 60 * 60 * 24 }); // Expires in one day

    // Redirect to the home page (GET /)
    return c.redirect("/", 302);
  } catch (error) {
    console.error("Error in POST /:", error);
    return c.text(`Internal Server Error: ${error}`, 500);
  }
});

export default app;
