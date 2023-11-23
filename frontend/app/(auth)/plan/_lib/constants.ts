import type { PlanPrisePosologies } from "@/types/plan";

export const PLAN_SETTINGS_DEFAULT: Required<PP.Plan.Settings> = {
  posos: {
    poso_lever: false,
    poso_matin: true,
    poso_10h: false,
    poso_midi: true,
    poso_16h: false,
    poso_18h: false,
    poso_soir: true,
    poso_coucher: true,
  },
};

export const PLAN_POSOLOGIE_COLOR: Record<
  keyof typeof PlanPrisePosologies,
  { header: string; body: string }
> = {
  poso_lever: {
    header: "bg-indigo-300",
    body: "bg-indigo-200",
  },
  poso_matin: {
    header: "bg-green-300",
    body: "bg-green-200",
  },
  poso_10h: {
    header: "bg-yellow-300",
    body: "bg-yellow-200",
  },
  poso_midi: {
    header: "bg-orange-300",
    body: "bg-orange-200",
  },
  poso_16h: {
    header: "bg-pink-300",
    body: "bg-pink-200",
  },
  poso_18h: {
    header: "bg-purple-300",
    body: "bg-purple-200",
  },
  poso_soir: {
    header: "bg-red-300",
    body: "bg-red-200",
  },
  poso_coucher: {
    header: "bg-blue-300",
    body: "bg-blue-200",
  },
};
