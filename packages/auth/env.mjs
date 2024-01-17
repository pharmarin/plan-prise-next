import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    RECAPTCHA_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET,
  },
});
