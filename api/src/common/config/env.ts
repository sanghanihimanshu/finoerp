interface Env {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

function getEnv(): Env {
  const requiredVars = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ] as const;

  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    HOST: process.env.HOST || "localhost",
    PORT: Number(process.env.PORT) || 4000,
    DATABASE_URL: process.env.DATABASE_URL!,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
  };
}

export const env = getEnv();
