import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { requestLogger } from "@/common/middleware/request-logger";
import { globalRateLimiter } from "@/common/middleware/rate-limiter";
import { authRoutes } from "@/modules/auth";
import { healthRoutes } from "@/modules/health";
import { env } from "@/common/config/env";
import { openapi } from "@elysiajs/openapi";

export const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  )
  .use(requestLogger)
  .use(globalRateLimiter)
  .use(
    openapi({
      documentation: {
        info: {
          title: "FinoERP API",
          version: "0.0.1",
          description: "FinoERP Construction Management System API",
        },
      },
    })
  )
  .use(authRoutes)
  .use(healthRoutes);
