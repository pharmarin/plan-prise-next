import { useMemo } from "react";
import PlanClient from "@/app/(auth)/plan/[planId]/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";
import type { Plan } from "@prisma/client";

import { PLAN_NEW } from "@plan-prise/api/constants";

const PlanNew = () => {
  const plan = useMemo(
    (): Plan & { data: PP.Plan.Data1 } => ({
      id: PLAN_NEW,
      medicsOrder: null,
      data: [],
      settings: {},
      userId: "",
      displayId: -1,
      createdAt: new Date(),
      updatedAt: null,
    }),
    [],
  );

  return (
    <>
      <Navigation title="Nouveau plan de prise" returnTo={routes.plans()} />
      <PlanClient plan={plan} />
    </>
  );
};

export default PlanNew;
