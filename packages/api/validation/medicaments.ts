import { VoieAdministration } from "@prisma/client";
import { z } from "zod";

import "./locale";

export const ALL_VOIES = "ALL_VOIES";

const updateCommentaireSchema = z.object({
  id: z.string().cuid2().optional(),
  voieAdministration: z.nativeEnum(VoieAdministration).optional(),
  population: z.string().optional(),
  texte: z.string(),
});

export const updateMedicSchema = z.object({
  id: z.string().cuid2(),
  denomination: z.string(),
  principesActifs: z.array(
    z.object({ denomination: z.string(), id: z.string() }),
  ),
  voiesAdministration: z.array(z.nativeEnum(VoieAdministration)),
  indications: z.array(z.object({ value: z.string() })),
  conservationFrigo: z.boolean(),
  conservationDuree: z.array(
    z.object({
      duree: z.string(),
      laboratoire: z.string().optional(),
    }),
  ),
  commentaires: z.array(updateCommentaireSchema),
});
