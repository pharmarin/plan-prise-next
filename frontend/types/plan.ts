export enum PlanPrisePosologies {
  "poso_matin" = "Matin",
  "poso_10h" = "10h",
  "poso_midi" = "Midi",
  "poso_16h" = "16h",
  "poso_18h" = "18h",
  "poso_soir" = "Soir",
  "poso_coucher" = "Coucher",
}

export type PlanDataItem = {
  indication?: string;
  posologies?: Record<keyof typeof PlanPrisePosologies, string | undefined>;
  commentaires?: Record<string, { checked?: boolean; texte?: string }>;
  custom_commentaires?: Record<string, { texte: string }>;
};
