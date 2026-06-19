import { Elysia } from "elysia";
import { logger } from "@/common/logger";

export const requestLogger = new Elysia({ name: "request-logger" }).onRequest(
  ({ request }) => {
    const url = new URL(request.url);
    logger.info(`→ ${request.method} ${url.pathname}`);
  }
);
