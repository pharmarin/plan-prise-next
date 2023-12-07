import { useMemo } from "react";
import Navigation from "@/app/_components/Navigation";
import PlanClient from "@/app/(auth)/plan/_components/PlanClient";

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
    }),
    [],
  );

  return (
    <>
      <Navigation title="Nouveau plan de prise" returnTo="/plan" />
      <PlanClient plan={plan} />
    </>
  );
};

export default PlanNew;
