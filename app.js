import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

app.get("/", async (c) => {
  try {
    // Retrieve the cookie value using getCookie
    let name = getCookie(c, "name");

    // Render the template
    const html = await eta.render("index.eta", { name });

    // Return the response
    return c.html(html);
  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Error ${error}`, 500);
  }
});

app.post("/", async (c) => {
  try {
			// Retrieve the name from the request body
			const formData = await c.req.parseBody();
			const name = formData.name;
			return c.text(`${name}`, 500);
			// Set the cookie value using setCookie
			setCookie(c, "name", name);

			// Redirect to the home page
			return c.redirect("/");
  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Error ${error}`, 500);
  }
});

export default app;
