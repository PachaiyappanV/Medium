import { Context, Next } from "hono";
import { verify } from "hono/jwt";
const authenticateUser = async (c: Context, next: Next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt || !jwt.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ error: "Authentication invalid" });
  }
  const token = jwt.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("userId", payload.id);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Authentication invalid" });
  }
};

export default authenticateUser;
