import type {
  Commentaire,
  Medicament as MedicamentType,
  Plan as PlanType,
  Precaution,
  PrincipeActif,
  VoieAdministration,
} from "@prisma/client";

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  export namespace PP {
    namespace Plan {
      enum PlanPrisePosologies {
        "poso_lever" = "Lever",
        "poso_matin" = "Matin",
        "poso_10h" = "10h",
        "poso_midi" = "Midi",
        "poso_16h" = "16h",
        "poso_18h" = "18h",
        "poso_soir" = "Soir",
        "poso_coucher" = "Coucher",
      }
      type MedicsOrder = string[] | null;
      type DataItem = {
        indication?: string;
        conservation?: string;
        posologies?: Record<
          keyof typeof PlanPrisePosologies,
          string | undefined
        >;
        commentaires?: Record<string, { checked?: boolean; texte?: string }>;
        custom_commentaires?: Record<string, { texte: string }>;
      };
      type Data1 = { medicId: string; data: DataItem }[];
      type Data = Record<string, DataItem> | Data1;
      type Settings = {
        posos?: Record<keyof typeof PlanPrisePosologies, boolean>;
      };
      type Include = PlanType & {
        medics: Medicament.Include[];
      };
    }
  }
}

declare global {
  namespace PP {
    namespace Medicament {
      type Custom = { id: string; denomination: string };
      type Identifier = {
        id: MedicamentType["id"];
        denomination: MedicamentType["denomination"];
      };
      type Include = MedicamentType & {
        commentaires: Commentaire[];
        principesActifs: PrincipeActif[];
        precaution?: Precaution | null;
      };
      /* type Include<
        K extends "commentaires" | "principesActifs" | undefined = undefined,
      > = MedicamentType &
        (K extends "commentaires"
          ? K extends "principesActifs"
            ? { commentaires: Commentaire[]; principesActifs: PrincipeActif[] }
            : { commentaires: Commentaire[] }
          : K extends "principesActifs"
          ? { principesActifs: PrincipeActif[] }
          : unknown); */
      type Indications = string[];
      type ConservationDuree = {
        laboratoire?: string;
        duree: string;
      }[];
      type VoiesAdministration = VoieAdministration[];
    }
  }
}

declare global {
  namespace PP {
    namespace Calendar {
      type DataItem = {
        startDate: string;
        endDate: string;
        quantity: string;
        frequency: number;
      };
      type Data = { medicId: string; data: DataItem[] }[];
    }
  }
}
