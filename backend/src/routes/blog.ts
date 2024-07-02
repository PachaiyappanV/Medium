import { Hono } from "hono";
import authenticateUser from "../middleware/authentication";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.post("/", authenticateUser, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    const blog = await prisma.blog.create({
      data: {
        authorId: userId,
        title: body.title,
        content: body.content,
      },
    });
    c.status(201);
    return c.json({
      blog,
    });
  } catch (err) {
    c.status(500);
    return c.json({ err: "Internal server error" });
  }
});

blogRouter.get("/api/v1/blog/:id", (c) => {
  return c.text("get single blog route");
});

blogRouter.put("/api/v1/blog/:id", (c) => {
  return c.text("update blog route");
});
