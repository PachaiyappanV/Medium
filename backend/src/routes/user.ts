import { Hono } from "hono";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";

export const userRouter = new Hono<{
  Bindings: {
    JWT_SECRET: string;
  };
  Variables: {
    prisma: any;
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = c.get("prisma");
  try {
    const body = await c.req.json();

    //Hasing password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(body.password, salt);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hasedPassword,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(201);
    return c.json({ jwt });
  } catch (err) {
    console.log(err);
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = c.get("prisma");
  try {
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(401);
      return c.json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      c.status(401);
      return c.json({ error: "Invalid credentials" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(200);
    return c.json({ jwt });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
});
