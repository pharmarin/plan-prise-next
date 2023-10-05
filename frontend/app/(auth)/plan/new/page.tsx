import PlanClient from "@/app/(auth)/plan/_components/PlanClient";
import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import Navigation from "@/components/navigation/Navigation";
import type { PlanInclude } from "@/types/plan";
import { useMemo } from "react";

const PlanNew = () => {
  const plan = useMemo(
    (): PlanInclude => ({
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
