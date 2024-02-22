import { z } from "zod";

import "./locale";

export const ALL_VOIES = "ALL_VOIES";

export const upsertPrincipeActifSchema = z.object({
  id: z.string().cuid2().optional(),
  denomination: z.string(),
});
