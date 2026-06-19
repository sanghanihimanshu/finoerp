import { Elysia } from "elysia";
import { auth } from "@/common/config/auth";

export const authRoutes = new Elysia().mount("/api/auth", auth.handler);
