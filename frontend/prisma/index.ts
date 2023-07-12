import type { PlanDataItem } from "@/types/plan";
import { PrismaClient, VoieAdministration } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma.$extends({
  result: {
    medicament: {
      voiesAdministrationParsed: {
        needs: { voiesAdministration: true },
        compute: ({ voiesAdministration }) => {
          if (
            Array.isArray(voiesAdministration) &&
            voiesAdministration.every((voieAdministration) =>
              Object.values(VoieAdministration).includes(
                voieAdministration as VoieAdministration
              )
            )
          ) {
            return voiesAdministration.map((voieAdministration) => {
              switch (voieAdministration) {
                case VoieAdministration.AURICULAIRE:
                  return "auriculaire";
                case VoieAdministration.AUTRE:
                  return "inconnue";
                case VoieAdministration.CUTANEE:
                  return "cutanée";
                case VoieAdministration.INHALEE:
                  return "inhalée";
                case VoieAdministration.INTRA_MUSCULAIRE:
                  return "intra-musculaire";
                case VoieAdministration.INTRA_URETRALE:
                  return "intra-urétrale";
                case VoieAdministration.INTRA_VEINEUX:
                  return "intra-veineuse";
                case VoieAdministration.NASALE:
                  return "nasale";
                case VoieAdministration.OCULAIRE:
                  return "oculaire";
                case VoieAdministration.ORALE:
                  return "orale";
                case VoieAdministration.RECTALE:
                  return "rectale";
                case VoieAdministration.SOUS_CUTANEE:
                  return "sous-cutanée";
                case VoieAdministration.VAGINALE:
                  return "vaginale";
                default:
                  return "";
              }
            });
          } else {
            return [];
          }
        },
      },
    },
    plan: {
      dataParsed: {
        needs: {
          data: true,
        },
        compute: ({ data }) => {
          if (typeof data === "object" && data) {
            return data as Record<string, PlanDataItem>;
          } else {
            return {};
          }
        },
      },
    },
  },
});
