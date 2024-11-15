import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getCookie, setCookie } from "https://deno.land/x/hono@v3.12.11/helper.ts";

const sessionCounts = new Map();
const app = new Hono();
const secret = "secret";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const getAndIncrementCount = (sessionId) => {
  let count = sessionCounts.get(sessionId) ?? 0;
  count++;
  sessionCounts.set(sessionId, count);
  return count;
};

app.get("/", async (c) => {
  try {
    // Retrieve the cookie value using getCookie
				const count = getAndIncrementCount(sessionId);
    // Render the template
    return c.html(await eta.render("index.eta", { count:count }));

  } catch (error) {
    console.error("Error in GET /:", error);
    return c.text(`Internal Server Error: ${error}`, 500);
  }
});

export default app;

