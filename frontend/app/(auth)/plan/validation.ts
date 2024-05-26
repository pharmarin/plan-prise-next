import { z } from "zod";

import { NEW } from "@plan-prise/api/constants";

export const savePlanDataSchema = z.object({
  planId: z.union([z.literal(NEW), z.string().cuid2()]),
  data: z.array(
    z.object({
      medicId: z.string(),
      data: z.object({
        indication: z.string().optional(),
        conservation: z.string().optional(),
        posologies: z
          .object({
            poso_matin: z.string().optional(),
            poso_10h: z.string().optional(),
            poso_midi: z.string().optional(),
            poso_16h: z.string().optional(),
            poso_18h: z.string().optional(),
            poso_soir: z.string().optional(),
            poso_coucher: z.string().optional(),
          })
          .optional(),
        commentaires: z
          .record(
            z.string().cuid2(),
            z
              .object({
                texte: z.string().optional(),
                checked: z.boolean().optional(),
              })
              .optional(),
          )
          .optional(),
        custom_commentaires: z
          .record(
            z.string().cuid2(),
            z.object({ texte: z.string().optional() }).optional(),
          )
          .optional(),
      }),
    }),
  ),
});
