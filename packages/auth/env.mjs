// @ts-check

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CI: z.coerce.boolean().optional(),
    RECAPTCHA_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    CI: process.env.CI,
    RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET,
  },
});
