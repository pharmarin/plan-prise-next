import type { MedicamentConservationDuree } from "@/types/medicament";
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
      conservationDureeParsed: {
        needs: { conservationDuree: true },
        compute: ({ conservationDuree }) => {
          if (Array.isArray(conservationDuree)) {
            return conservationDuree as MedicamentConservationDuree;
          } else {
            return null;
          }
        },
      },
      indicationsParsed: {
        needs: { indications: true },
        compute: ({ indications }): string[] => {
          if (Array.isArray(indications)) {
            return indications as string[];
          } else {
            return [];
          }
        },
      },
      voiesAdministrationParsed: {
        needs: { voiesAdministration: true },
        compute: ({ voiesAdministration }): string[] => {
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
        compute: ({ data }): Record<string, PlanDataItem> => {
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
