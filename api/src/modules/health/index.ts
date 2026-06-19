import { Elysia } from "elysia";
import { env } from "@/common/config/env";

export const healthRoutes = new Elysia().get("/health", () => ({
  status: "ok",
  environment: env.NODE_ENV,
  timestamp: new Date().toISOString(),
}));
