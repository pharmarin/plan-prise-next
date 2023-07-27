"use client";

import PlanCard from "@/app/(auth)/plan/[id]/PlanCard";
import usePlanStore from "@/app/(auth)/plan/[id]/state";
import LoadingScreen from "@/components/overlays/screens/LoadingScreen";
import type { PlanInclude } from "@/types/plan";
import { useEffect, useState } from "react";

const PlanClient = ({ plan }: { plan: PlanInclude }) => {
  const [ready, setReady] = useState(false);

  const init = usePlanStore((state) => state.init);
  const medics = usePlanStore((state) => state.medics);

  useEffect(() => {
    console.log("Initializing zustand for plan");
    init(plan);
    setReady(true);
  }, [init, plan]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      {medics &&
        medics.map((row) => (
          <PlanCard key={`plan_${plan.id}_${row.id}`} medicamentId={row.id} />
        ))}
    </div>
  );
};

export default PlanClient;
