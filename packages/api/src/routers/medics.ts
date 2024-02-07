import { isCuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import prisma from "@plan-prise/db-prisma";

import {
  upsertMedicServerSchema,
  upsertPrincipeActifSchema,
} from "../../validation/medicaments";
import { MUTATION_SUCCESS } from "../constants";
import { adminProcedure, authProcedure, createTRPCRouter } from "../trpc";

const medicsRouter = createTRPCRouter({
  unique: authProcedure.input(z.string().cuid2()).query(({ input }) =>
    prisma.medicament.findUniqueOrThrow({
      where: { id: input },
      include: { commentaires: true, principesActifs: true },
    }),
  ),
  findAll: authProcedure
    .input(
      z.object({
        fields: z.array(
          z
            .string()
            .refine((field) =>
              Object.keys(prisma.medicament.fields).includes(field),
            ),
        ),
        value: z.string(),
      }),
    )
    .query(({ input }) =>
      input.value && input.value.length > 0
        ? prisma.medicament.findMany({
            where: {
              OR: input.fields.map((field) => ({
                [field]: { contains: input.value },
              })),
            },
            select: {
              id: true,
              denomination: true,
              principesActifs: true,
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

      return ctx.prisma.precaution.findMany({
        where: {
          medicaments: {
            some: {
              OR: input.filter((id) => isCuid(id)).map((id) => ({ id })),
            },
          },
        },
      });
    }),
  upsert: adminProcedure
    .input(upsertMedicServerSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, commentaires, indications, principesActifs, ...data } = input;

      await ctx.prisma.medicament.update({
        where: { id },
        data: {
          commentaires: {
            upsert: commentaires.map((commentaire) => ({
              where: { id: commentaire.id },
              update: {
                population: commentaire.population,
                voieAdministration: commentaire.voieAdministration,
                texte: commentaire.texte,
              },
              create: {
                population: commentaire.population,
                voieAdministration: commentaire.voieAdministration,
                texte: commentaire.texte,
              },
            })),
          },
          indications: indications.map((indication) => indication.value),
          principesActifs: {
            connect: principesActifs.map((principeActif) => ({
              id: principeActif.id,
            })),
          },
          ...data,
        },
      });

      return MUTATION_SUCCESS;
    }),
  findManyPrincipesActifs: adminProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      if (input.length < 4) return undefined;

      return ctx.prisma.principeActif.findMany({
        where: {
          denomination: {
            contains: input,
          },
        },
        take: 10,
      });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.medicament.delete({ where: { id: input.id } }),
    ),
  deleteCommentaire: adminProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.commentaire.delete({
        where: { id: input.id },
      }),
    ),
  deletePrincipeActif: adminProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.principeActif.delete({
        where: { id: input.id },
      }),
    ),
  upsertPrincipeActif: adminProcedure.input(upsertPrincipeActifSchema).mutation(
    async ({ ctx, input }) =>
      await ctx.prisma.principeActif.upsert({
        where: { id: input.id },
        create: { denomination: input.denomination },
        update: { denomination: input.denomination },
      }),
  ),
});

export default medicsRouter;
