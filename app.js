import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

app.get("/", async (c) => {
  try {
    // Retrieve the cookie value using getCookie
    let name = getCookie(c, "name");
				const rname = name;
    // Render the template
    return c.html(eta.render("index.eta", { rname }));

  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Errorrrr ${error}`, 500);
  }
});

app.post("/", async (c) => {
  try {
			// Retrieve the name from the request body
			const formData = await c.req.parseBody();
			const name = formData.name;
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
