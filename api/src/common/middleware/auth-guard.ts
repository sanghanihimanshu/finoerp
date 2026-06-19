import { Elysia } from "elysia";
import { auth } from "@/common/config/auth";

export const authGuard = new Elysia({ name: "auth-guard" }).derive(
  { as: "scoped" },
  async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return { user: session?.user ?? null, session: session?.session ?? null };
  }
);
