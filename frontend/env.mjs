// @ts-check

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const envBoolean = z
  .union([
    z.literal("true"),
    z.literal("false"),
    z.literal("1"),
    z.literal("0"),
  ])
  .transform((s) => s === "true" || s === "1");

export const env = createEnv({
  server: {
    ANALYZE: envBoolean.optional(),
    CI: z.coerce.boolean().optional(),
    DATABASE_URL_POSTGRE: z.string().url(),
    BACKEND_URL: z.string().url(),
    MAINTENANCE_MODE: envBoolean.optional(),
    NTFY_ADMIN_URL: process.env.CI
      ? z.string().url().optional()
      : z.string().url(),
    PLAYWRIGHT_TEST_BASE_URL: z.string().url().optional(),
  },
  client: { NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string() },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    CI: process.env.CI,
    DATABASE_URL_POSTGRE: process.env.DATABASE_URL_POSTGRE,
    BACKEND_URL: process.env.BACKEND_URL,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    NTFY_ADMIN_URL: process.env.NTFY_ADMIN_URL,
    PLAYWRIGHT_TEST_BASE_URL: process.env.PLAYWRIGHT_TEST_BASE_URL,
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
  },
});
