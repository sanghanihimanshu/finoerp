import { app } from "./app";
import { env } from "@/common/config/env";
import { logger } from "@/common/logger";

app.listen(
  {
    hostname: env.HOST,
    port: env.PORT,
  },
  () => {
    logger.info(
      `🚀 Server is running at http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`
    );
  }
);
