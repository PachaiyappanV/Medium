import { Hono } from "hono";
import authenticateUser from "../middleware/authentication";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@pachaiyappan/common-app";

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
    const { success } = createPostInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "invalid input" });
    }
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

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });
    c.status(200);
    return c.json({ blog });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
});

blogRouter.put("/", authenticateUser, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  try {
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ error: "invalid input" });
    }
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    c.status(200);
    return c.json({ blog });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
});
