// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const envBoolean = z
  .string()
  .optional()
  .refine((s) => s === undefined || s === "true" || s === "false")
  .transform((s) => (s === undefined ? undefined : s === "true"));

export const env = createEnv({
  server: {
    ANALYZE: envBoolean,
    APP_NAME: z.string(),
    CI: envBoolean,
    DATABASE_URL: z.string().url(),
    BACKEND_URL: z.string().url(),
    MAINTENANCE_MODE: envBoolean,
    NODE_ENV: z.enum(["development", "production", "test"]),
    PLAYWRIGHT_TEST_BASE_URL: z.string().url().optional(),
  },
  client: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string() },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    APP_NAME: process.env.APP_NAME,
    CI: process.env.CI,
    DATABASE_URL: process.env.DATABASE_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    NODE_ENV: process.env.NODE_ENV,
    PLAYWRIGHT_TEST_BASE_URL: process.env.PLAYWRIGHT_TEST_BASE_URL,
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
  },
});
