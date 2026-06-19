import { rateLimit } from "elysia-rate-limit";
import { Elysia } from "elysia";

export const globalRateLimiter = new Elysia({ name: "rate-limiter" }).use(
  rateLimit({
    max: 100,
    duration: 60_000,
  })
);
