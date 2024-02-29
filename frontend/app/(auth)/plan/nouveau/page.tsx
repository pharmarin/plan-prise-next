import { useMemo } from "react";
import PlanClient from "@/app/(auth)/plan/[planId]/client";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/app/state-navigation";

import { PLAN_NEW } from "@plan-prise/api/constants";

const PlanNew = () => {
  const plan = useMemo(
    (): PP.Plan.Include => ({
      id: PLAN_NEW,
      medicsOrder: [],
      data: {},
      settings: {},
      userId: "",
      displayId: -1,
      medics: [],
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
