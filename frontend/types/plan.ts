import type { MedicamentInclude } from "@/types/medicament";
import type { Plan } from "@prisma/client";

export type PlanInclude = Plan & {
  medics: MedicamentInclude[];
};

export enum PlanPrisePosologies {
  "poso_lever" = "Lever",
  "poso_matin" = "Matin",
  "poso_10h" = "10h",
  "poso_midi" = "Midi",
  "poso_16h" = "16h",
  "poso_18h" = "18h",
  "poso_soir" = "Soir",
  "poso_coucher" = "Coucher",
}

export type PlanData = Record<string, PlanDataItem>;

export interface PlanDataItem {
  indication?: string;
  conservation?: string;
  posologies?: Record<keyof typeof PlanPrisePosologies, string | undefined>;
  commentaires?: Record<string, { checked?: boolean; texte?: string }>;
  custom_commentaires?: Record<string, { texte: string }>;
}

export interface PlanSettings {
  posos: Record<keyof typeof PlanPrisePosologies, boolean>;
}
