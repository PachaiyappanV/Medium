import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import authenticateUser from "./middleware/authentication";
import { userRouter } from "./routes/user";

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    prisma: any;
  };
}>();

app.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set("prisma", prisma);
  await next();
});

app.route("/api/v1/user", userRouter);
app.post("/api/v1/blog", authenticateUser, async (c) => {
  return c.text("create blog route");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("get single blog route");
});

app.put("/api/v1/blog/:id", (c) => {
  return c.text("update blog route");
});

export default app;
