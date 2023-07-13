type PlanPrisePosologies =
  | "poso_matin"
  | "poso_10h"
  | "poso_midi"
  | "poso_16h"
  | "poso_18h"
  | "poso_soir"
  | "poso_coucher";

export type PlanDataItem = {
  indication?: string;
  posologies?: Record<PlanPrisePosologies, string | undefined>;
  commentaires?: Record<string, { checked: boolean }>;
  custom_commentaires?: Record<string, { texte: string }>;
};
