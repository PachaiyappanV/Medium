import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const jwt = await sign({ id: (await user).id }, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (err) {
    console.log(err);
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
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
