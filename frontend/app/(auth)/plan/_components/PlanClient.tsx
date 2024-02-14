"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PlanCard from "@/app/(auth)/plan/_components/PlanCard";
import PlanCardLoading from "@/app/(auth)/plan/_components/PlanCardLoading";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { routes } from "@/app/routes-schema";
import { trpc } from "@/utils/api";
import { isCuid } from "@paralleldrive/cuid2";
import { debounce } from "lodash";
import type { SelectInstance } from "react-select";
import ReactSelect from "react-select";
import { shallow } from "zustand/shallow";

import { PLAN_NEW } from "@plan-prise/api/constants";
import errors from "@plan-prise/errors/errors.json";
import LoadingScreen from "@plan-prise/ui/components/pages/Loading";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";

type SelectValueType = {
  denomination: string;
  principesActifs: string[];
  id: string;
  custom?: boolean;
};

const PlanClient = ({ plan }: { plan: PP.Plan.Include }) => {
  const selectRef = useRef<SelectInstance<SelectValueType> | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [ready, setReady] = useState(false);

  const { init, addMedic, removeMedic, setIsSaving } = usePlanStore(
    (state) => ({
      init: state.init,
      addMedic: state.addMedic,
      removeMedic: state.removeMedic,
      setIsSaving: state.setIsSaving,
    }),
  );
  const medics = usePlanStore((state) => state.medics);

  const [searchValue, setSearchValue] = useState("");
  const setSearchValueDebounced = debounce(setSearchValue, 500);
  const { data: searchResults, isLoading: isLoadingResults } =
    trpc.medics.findAll.useQuery(
      {
        fields: ["denomination"],
        value: searchValue,
      },
      { enabled: searchValue.length > 2 },
    );

  const [addingMedics, setAddingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);
  const { mutateAsync: addMedicServer } = trpc.plan.addMedic.useMutation();

  const [removingMedics, setRemovingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);
  const removingMedicsId = removingMedics.map((medic) => medic.id);
  const { mutateAsync: removeMedicServer } =
    trpc.plan.removeMedic.useMutation();

  const { mutateAsync: saveData } = trpc.plan.saveData.useMutation();
  const saveDataDebounced = debounce(
    async (data: Parameters<typeof saveData>["0"]) => {
      setIsSaving(true);
      await saveData(data);
      setIsSaving(false);
    },
    2000,
  );

  const { data: precautions } =
    trpc.medics.findPrecautionsByMedicId.useQuery(medics);

  useEffect(() => {
    init(plan);
    setReady(true);
  }, [init, plan]);

  useEffect(() => {
    const unsubscribe = usePlanStore.subscribe(
      (state) => ({ id: state.id, data: state.data }),
      async (newState, previousState) => {
        if (previousState.id !== PLAN_NEW && newState.data !== null) {
          await saveDataDebounced({
            planId: newState.id ?? "",
            data: newState.data ?? {},
          });
        }
      },
      { equalityFn: shallow },
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      {medics?.map((id) =>
        removingMedicsId.includes(id) ? (
          <PlanCardLoading
            key={`plan_${plan.id}_${id}_removing`}
            denomination={
              removingMedics.find((medic) => medic.id === id)?.denomination ??
              ""
            }
            type="deleting"
          />
        ) : (
          <PlanCard
            key={`plan_${plan.id}_${id}`}
            medicamentId={id}
            medicamentData={
              isCuid(id)
                ? plan.medics.find((medicament) => medicament.id === id)
                : {
                    id,
                    denomination: id,
                    indications: [],
                    conservationFrigo: false,
                    conservationDuree: [],
                    voiesAdministration: [],
                    commentaires: [],
                    medics_simpleId: 0,
                    principesActifs: [],
                    precaution_old: "",
                    precautionId: null,
                    createdAt: new Date(),
                    updatedAt: null,
                  }
            }
            removeMedic={async (medicament: PP.Medicament.Identifier) => {
              setRemovingMedics((state) => [
                ...state,
                {
                  id: medicament.id,
                  denomination: medicament.denomination,
                },
              ]);
              await removeMedicServer({
                planId: plan.id,
                medicId: medicament.id,
              })
                .then(() => removeMedic(medicament.id))
                .catch(() => {
                  toast({
                    title: `Impossible de supprimer ${medicament.denomination} pour le moment`,
                    description: "Veuillez réessayer",
                    variant: "destructive",
                  });
                })
                .finally(() => {
                  setRemovingMedics((state) => [
                    ...state.filter((medic) => medic.id !== medicament.id),
                  ]);
                });
            }}
          />
        ),
      )}
      {addingMedics.map((row) => (
        <PlanCardLoading
          key={`plan_${plan.id}_${row.id}_adding`}
          denomination={row.denomination}
          type="adding"
        />
      ))}
      <ReactSelect<SelectValueType>
        classNames={{
          control: () => "!border-0 !rounded-lg !shadow-md",
          menu: () => "!border-0 !rounded-lg !shadow-md !z-10",
        }}
        getOptionLabel={(option) => option.denomination}
        getOptionValue={(option) => option.id}
        isLoading={searchValue.length > 0 && isLoadingResults}
        loadingMessage={({ inputValue }) =>
          inputValue.length > 2
            ? "Chargement des médicaments en cours"
            : "Tapez 3 lettres pour commencer la recherche"
        }
        menuPlacement={medics && medics.length > 0 ? "top" : "bottom"}
        noOptionsMessage={(p) =>
          p.inputValue.length > 0
            ? "Aucun résultat"
            : "Cherchez le nom d'un médicament pour l'ajouter au plan de prise"
        }
        onChange={async (value) => {
          if (value) {
            setSearchValue("");
            if (medics && medics.includes(value.id)) {
              toast({
                title: errors.PLAN_MEDICAMENT_ALREADY_ADDED_ERROR,
                variant: "destructive",
              });
              return;
            }
            setAddingMedics((state) => [
              ...state,
              {
                id: value.id,
                denomination: value.custom ? value.id : value.denomination,
              },
            ]);
            await addMedicServer({
              planId: plan.id,
              medicId: value.id,
            })
              .then((response) => {
                if (plan.id === PLAN_NEW) {
                  if (typeof response === "object" && "id" in response) {
                    init(response);
                    router.replace(routes.plan({ planId: response.displayId }));
                  }
                } else {
                  addMedic(value.id);
                }
              })
              .catch(() => {
                toast({
                  title: `Impossible d'ajouter ${value.denomination} pour le moment`,
                  description: "Veuillez réessayer",
                  variant: "destructive",
                });
              })
              .finally(() => {
                selectRef.current?.clearValue();
                setAddingMedics((state) => [
                  ...state.filter((medic) => medic.id !== value.id),
                ]);
              });
          }
        }}
        onInputChange={(value) => setSearchValueDebounced(value)}
        openMenuOnFocus={true}
        options={
          searchResults
            ? searchResults.length > 0
              ? searchResults.map((result) => ({
                  denomination: result.denomination,
                  principesActifs: result.principesActifs.map(
                    (principeActif) => principeActif.denomination,
                  ),
                  id: result.id,
                }))
              : [
                  {
                    id: searchValue.toUpperCase(),
                    denomination: `Ajouter ${searchValue.toUpperCase()}`,
                    principesActifs: [""],
                    custom: true,
                  },
                ]
            : undefined
        }
        placeholder="Ajouter un médicament"
        ref={(ref) => {
          selectRef.current = ref;
          plan.id === PLAN_NEW && ref?.focus();
        }}
      />
      {precautions && (
        <div className="mt-8 space-y-4">
          {precautions.map((precaution) => (
            <div
              key={precaution.id}
              className="rounded-lg border p-4 shadow-md"
              style={{ borderColor: precaution.couleur }}
            >
              <p className="font-semibold">{precaution.titre}</p>
              <p
                className="prose"
                dangerouslySetInnerHTML={{ __html: precaution.contenu }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanClient;
