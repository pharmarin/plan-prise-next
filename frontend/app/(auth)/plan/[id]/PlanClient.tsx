"use client";

import PlanCard from "@/app/(auth)/plan/[id]/PlanCard";
import usePlanStore from "@/app/(auth)/plan/[id]/state";
import LoadingScreen from "@/components/overlays/screens/LoadingScreen";
import { trpc } from "@/trpc/client";
import type { PlanInclude } from "@/types/plan";
import { useEffect, useState } from "react";
import Select from "react-select";

const PlanClient = ({ plan }: { plan: PlanInclude }) => {
  const [ready, setReady] = useState(false);

  const init = usePlanStore((state) => state.init);
  const medics = usePlanStore((state) => state.medics);

  const [searchValue, setSearchValue] = useState("");
  const searchResult = trpc.medics.findAll.useQuery({
    fields: ["denomination"],
    value: searchValue,
  });

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
      <Select<{
        denomination: string;
        principesActifs: string[];
        id: string;
      }>
        classNames={{
          control: () => "!border-0 !rounded-lg !shadow-md",
          menu: () => "!border-0 !rounded-lg !shadow-md",
        }}
        getOptionLabel={(option) => option.denomination}
        getOptionValue={(option) => option.id}
        isLoading={searchResult.isLoading}
        loadingMessage={() => "Chargement des médicaments en cours"}
        noOptionsMessage={(p) =>
          p.inputValue.length > 0
            ? "Aucun résultat"
            : "Cherchez le nom d'un médicament pour l'ajouter au plan de prise"
        }
        onInputChange={(value) => setSearchValue(value)}
        options={(searchResult.data || []).map((result) => ({
          denomination: result.denomination,
          principesActifs: result.principesActifs.map(
            (principeActif) => principeActif.denomination,
          ),
          id: result.id,
        }))}
        placeholder="Ajouter un médicament"
      />
    </div>
  );
};

export default PlanClient;
