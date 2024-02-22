import { z } from "zod";

export const upsertPrincipeActifSchema = z.object({
  id: z.string().cuid2().optional(),
  denomination: z.string(),
});
