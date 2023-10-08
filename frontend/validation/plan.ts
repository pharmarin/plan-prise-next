import { z } from "zod";

export const planSettingsSchema = z.object({
  posos: z.object({
    poso_matin: z.boolean().optional().default(true),
    poso_10h: z.boolean().optional().default(false),
    poso_midi: z.boolean().optional().default(true),
    poso_16h: z.boolean().optional().default(false),
    poso_18h: z.boolean().optional().default(false),
    poso_soir: z.boolean().optional().default(true),
    poso_coucher: z.boolean().optional().default(true),
  }),
});
