"use client";

import PlanCard from "@/app/(auth)/plan/[id]/PlanCard";
import PlanCardMutating from "@/app/(auth)/plan/[id]/PlanCardMutating";
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
  const setMedics = usePlanStore((state) => state.setMedics);

  const [searchValue, setSearchValue] = useState("");
  const { data: searchResults, isLoading: isLoadingResults } =
    trpc.medics.findAll.useQuery({
      fields: ["denomination"],
      value: searchValue,
    });

  const [addingMedics, setAddingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);
  const { mutateAsync: addMedic } = trpc.plan.addMedic.useMutation();

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
        medics.map((id) => (
          <PlanCard key={`plan_${plan.id}_${id}`} medicamentId={id} />
        ))}
      {addingMedics.map((row) => (
        <PlanCardMutating
          key={`plan_${plan.id}_${row.id}`}
          denomination={row.denomination}
          type="adding"
        />
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
        isLoading={isLoadingResults}
        loadingMessage={() => "Chargement des médicaments en cours"}
        noOptionsMessage={(p) =>
          p.inputValue.length > 0
            ? "Aucun résultat"
            : "Cherchez le nom d'un médicament pour l'ajouter au plan de prise"
        }
        onChange={async (value) => {
          if (value) {
            setSearchValue("");
            setAddingMedics((state) => [
              ...state,
              { id: value.id, denomination: value.denomination },
            ]);
            await addMedic({
              planId: plan.id,
              medicId: value.id,
            }).then((response) =>
              setMedics(response.medicsIdSorted as string[]),
            );
            setAddingMedics((state) => [
              ...state.filter((medic) => medic.id !== value.id),
            ]);
          }
        }}
        onInputChange={(value) => setSearchValue(value)}
        options={(searchResults || []).map((result) => ({
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
