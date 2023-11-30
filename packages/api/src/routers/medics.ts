import { isCuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import { db } from "@plan-prise/db-drizzle";

import { authProcedure, createTRPCRouter } from "../trpc";

const medicsRouter = createTRPCRouter({
  unique: authProcedure.input(z.string().cuid2()).query(({ ctx, input }) =>
    ctx.db.query.medicaments.findFirst({
      where: (fields, { eq }) => eq(fields.id, input),
      with: {
        commentaires: true,
        medicamentToPrincipeActif: { with: { principeActif: true } },
      },
    }),
  ),
  findManyByDenomination: authProcedure.input(z.string()).query(({ input }) =>
    input && input.length > 0
      ? db.query.medicaments.findMany({
          where: (fields, { like }) => like(fields.denomination, `${input}%`),
          columns: {
            id: true,
            denomination: true,
          },
          with: {
            medicamentToPrincipeActif: { with: { principeActif: true } },
          },
        })
      : [],
  ),
  findPrecautionsByMedicId: authProcedure
    .input(z.array(z.string()).optional())
    .query(({ ctx, input }) => {
      if (!input) {
        return [];
      }

      return ctx.db.query.precautions.findMany({
        with: {
          medicaments: {
            where: (field, { inArray }) =>
              inArray(
                field.id,
                input.filter((id) => isCuid(id)),
              ),
          },
        },
      });
    }),
});

export default medicsRouter;
