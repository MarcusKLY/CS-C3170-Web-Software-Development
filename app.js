import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const app = new Hono();

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

app.get("/", async (c) => {
  try {
    // Retrieve the cookie value using getCookie
    let name = getCookie(c.req.headers, "name") || "World";

    // Render the template
    const html = await eta.render("index.eta", { name });

    // Return the response
    return c.html(html);
  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Error ${error}`, 500);
  }
});

export default app;
