// Import Hono and the functions from store.js
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getStore, setStore } from "./store.js";

// Initialize Hono application
const app = new Hono();

// Define GET request handler
app.get("/", (c) => {
  // Check if 'store' query parameter is present in the GET request
  const storeParam = c.req.query("store");
  
  // If 'store' parameter is provided, set the new value and respond with it
  if (storeParam) {
    setStore(storeParam);
    return c.text(`Store: ${getStore()}`);
  } 
  // If no 'store' parameter, respond with the current stored value
  else {
    return c.text(`Store: ${getStore()}`);
  }
});

// Start the server
Deno.serve(app.fetch);
