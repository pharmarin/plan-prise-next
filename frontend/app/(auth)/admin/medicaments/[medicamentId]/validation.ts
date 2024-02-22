import { VoieAdministration } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

/**
 * MEDICAMENT
 */

export const upsertMedicSchema = z.object({
  id: z.string().cuid2(),
  denomination: z.string(),
  principesActifs: z
    .array(z.object({ denomination: z.string(), id: z.string() }))
    .min(1),
  voiesAdministration: z.array(z.nativeEnum(VoieAdministration)),
  indications: z.array(z.object({ value: z.string() })),
  conservationFrigo: z.boolean(),
  conservationDuree: z.array(
    z.object({
      duree: z.string(),
      laboratoire: z.string().or(z.literal("")),
    }),
  ),
  commentaires: z.array(z.object({ commentaireId: z.string().cuid2() })),
});

/**
 * COMMENTAIRE
 */

export const upsertCommentaireFormSchema = z.object({
  id: z.string().cuid2().optional(),
  voieAdministration: z.nativeEnum(VoieAdministration).or(z.literal("")),
  population: z.string(),
  texte: z.string(),
});

export const upsertCommentaireSchema = z.object({
  id: zfd.text(upsertCommentaireFormSchema.shape.id),
  medicId: z.string().cuid2().optional(),
  voieAdministration:
    upsertCommentaireFormSchema.shape.voieAdministration.transform((value) =>
      Object.keys(VoieAdministration).includes(value)
        ? (value as VoieAdministration)
        : null,
    ),
  population: zfd.text(upsertCommentaireFormSchema.shape.population),
  texte: zfd.text(upsertCommentaireFormSchema.shape.texte),
});
