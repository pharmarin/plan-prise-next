import type { PlanSettings } from "@/types/plan";

export const PLAN_NEW = "PLAN_NEW";

export const PLAN_SETTINGS_DEFAULT: PlanSettings = {
  posos: {
    poso_matin: true,
    poso_10h: false,
    poso_midi: true,
    poso_16h: false,
    poso_18h: false,
    poso_soir: true,
    poso_coucher: true,
  },
};
