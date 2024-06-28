import { Hono } from "hono";

// Create the main Hono app
const app = new Hono();

app.post("/api/v1/signup", (c) => {
  return c.text("signup route");
});

app.post("/api/v1/signin", (c) => {
  return c.text("signin route");
});

app.post("/api/v1/blog", (c) => {
  return c.text("create blog route");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("get single blog route");
});

app.put("/api/v1/blog/:id", (c) => {
  return c.text("update blog route");
});

export default app;
