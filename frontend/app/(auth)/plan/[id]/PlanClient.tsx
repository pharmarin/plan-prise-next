"use client";

import PlanCard from "@/app/(auth)/plan/[id]/PlanCard";
import PlanCardMutating from "@/app/(auth)/plan/[id]/PlanCardMutating";
import usePlanStore from "@/app/(auth)/plan/[id]/state";
import LoadingScreen from "@/components/overlays/screens/LoadingScreen";
import { trpc } from "@/trpc/client";
import type { MedicamentIdentifier } from "@/types/medicament";
import type { PlanInclude } from "@/types/plan";
import { useEffect, useRef, useState } from "react";
import Select, { type SelectInstance } from "react-select";

type SelectValueType = {
  denomination: string;
  principesActifs: string[];
  id: string;
};

const PlanClient = ({ plan }: { plan: PlanInclude }) => {
  const [ready, setReady] = useState(false);

  const init = usePlanStore((state) => state.init);
  const medics = usePlanStore((state) => state.medics);
  const setMedics = usePlanStore((state) => state.setMedics);

  const selectRef = useRef<SelectInstance<SelectValueType> | null>(null);

  const [searchValue, setSearchValue] = useState("");
  //const debounceSetSearchValue = debounce(setSearchValue, 10000);
  const { data: searchResults, isLoading: isLoadingResults } =
    trpc.medics.findAll.useQuery({
      fields: ["denomination"],
      value: searchValue,
    });

  const [addingMedics, setAddingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);
  const { mutateAsync: addMedic } = trpc.plan.addMedic.useMutation();

  const [removingMedics, setRemovingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);
  const removingMedicsId = removingMedics.map((medic) => medic.id);
  const { mutateAsync: removeMedic } = trpc.plan.removeMedic.useMutation();

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
        medics.map((id) =>
          removingMedicsId.includes(id) ? (
            <PlanCardMutating
              key={`plan_${plan.id}_${id}_removing`}
              denomination={
                removingMedics.find((medic) => medic.id === id)?.denomination ||
                ""
              }
              type="deleting"
            />
          ) : (
            <PlanCard
              key={`plan_${plan.id}_${id}`}
              medicamentId={id}
              removeMedic={async (medicament: MedicamentIdentifier) => {
                setRemovingMedics((state) => [
                  ...state,
                  { id: medicament.id, denomination: medicament.denomination },
                ]);
                await removeMedic({
                  planId: plan.id,
                  medicId: medicament.id,
                }).then((response) => setMedics(response.medicsIdSorted));
                setRemovingMedics((state) => [
                  ...state.filter((medic) => medic.id !== medicament.id),
                ]);
              }}
            />
          ),
        )}
      {addingMedics.map((row) => (
        <PlanCardMutating
          key={`plan_${plan.id}_${row.id}_adding`}
          denomination={row.denomination}
          type="adding"
        />
      ))}
      <Select<SelectValueType>
        classNames={{
          control: () => "!border-0 !rounded-lg !shadow-md",
          menu: () => "!border-0 !rounded-lg !shadow-md",
        }}
        getOptionLabel={(option) => option.denomination}
        getOptionValue={(option) => option.id}
        isLoading={isLoadingResults}
        loadingMessage={() => "Chargement des médicaments en cours"}
        menuPlacement="top"
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
            }).then((response) => setMedics(response.medicsIdSorted));
            selectRef.current?.clearValue();
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
        ref={selectRef}
      />
      <p className="font-mono">{medics?.join("\n")}</p>
    </div>
  );
};

export default PlanClient;
