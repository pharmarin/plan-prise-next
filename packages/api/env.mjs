import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_NAME: z.string(),
    CROSS_SITE_SECRET: z.string(),
    MAIL_FROM_ADDRESS: process.env.CI
      ? z.string().email().optional()
      : z.string().email(),
    MAILERSEND_API_KEY: process.env.CI ? z.string().optional() : z.string(),
    NTFY_ADMIN_URL: process.env.CI
      ? z.string().url().optional()
      : z.string().url(),
  },
  client: {},
  runtimeEnv: {
    APP_NAME: process.env.APP_NAME,
    CROSS_SITE_SECRET: process.env.CROSS_SITE_SECRET,
    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
    MAILERSEND_API_KEY: process.env.MAILERSEND_API_KEY,
    NTFY_ADMIN_URL: process.env.NTFY_ADMIN_URL,
  },
});
