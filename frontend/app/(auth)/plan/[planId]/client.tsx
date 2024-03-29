"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/_components/card";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import {
  addMedicAction,
  deleteAction,
  findManyMedicsAction,
  findPrecautionsAction,
  removeMedicAction,
  saveDataAction,
} from "@/app/(auth)/plan/[planId]/actions";
import PlanCardBody from "@/app/(auth)/plan/[planId]/card-body";
import PlanSettings from "@/app/(auth)/plan/[planId]/settings";
import usePlanStore from "@/app/(auth)/plan/state";
import { routes } from "@/app/routes-schema";
import { useNavigationState } from "@/app/state-navigation";
import { useEventListener } from "@/utils/event-listener";
import { isCuid } from "@paralleldrive/cuid2";
import { debounce } from "lodash-es";
import type { SelectInstance } from "react-select";
import ReactSelect from "react-select";
import { useShallow } from "zustand/react/shallow";

import { PLAN_NEW } from "@plan-prise/api/constants";
import errors from "@plan-prise/errors/errors.json";
import CardLoading from "@plan-prise/ui/components/card-loading";
import LoadingScreen from "@plan-prise/ui/components/pages/Loading";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

type SelectValueType = {
  denomination: string;
  principesActifs: string[];
  id: string;
  custom?: boolean;
};

enum EVENTS {
  DELETE_PLAN = "DELETE_PLAN",
  TOGGLE_SETTINGS = "TOGGLE_SETTINGS",
  PRINT_PLAN = "PRINT_PLAN",
}

const PlanClient = ({ plan }: { plan: PP.Plan.Include }) => {
  const selectRef = useRef<SelectInstance<SelectValueType> | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { init, addMedic, removeMedic, setIsSaving } = usePlanStore(
    useShallow((state) => ({
      init: state.init,
      addMedic: state.addMedic,
      removeMedic: state.removeMedic,
      setIsSaving: state.setIsSaving,
    })),
  );
  const medics = usePlanStore((state) => state.medics);

  const [searchValue, setSearchValue] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setSearchValueDebounced = useCallback(
    debounce(setSearchValue, 500),
    [],
  );
  const [
    { data: searchResults, isLoading: isLoadingResults, reset },
    findManyMedics,
  ] = useAsyncCallback(findManyMedicsAction);

  useEffect(() => {
    if (searchValue.length > 2) {
      void findManyMedics({ query: searchValue });
    }
  }, [findManyMedics, searchValue]);

  const [addingMedics, setAddingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);

  const [removingMedics, setRemovingMedics] = useState<
    { id: string; denomination: string }[]
  >([]);
  const removingMedicsId = removingMedics.map((medic) => medic.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveDataDebounced = useCallback(
    debounce(async (data: Parameters<typeof saveDataAction>["0"]) => {
      await saveDataAction(data);
      setIsSaving(false);
    }, 2000),
    [],
  );

  const [{ isLoading: isDeleting }, deletePlan] =
    useAsyncCallback(deleteAction);

  const [{ data: precautions }] = useAsyncCallback(findPrecautionsAction);

  useEffect(() => {
    init(plan);
    setReady(true);
  }, [init, plan]);

  /**
   * NAVBAR
   */

  const { setOptions, setTitle } = useNavigationState(
    useShallow((state) => ({
      setOptions: state.setOptions,
      setTitle: state.setTitle,
    })),
  );
  const isSaving = usePlanStore((state) => state.isSaving);
  const canPrint = usePlanStore((state) => state.canPrint);

  useEventListener(EVENTS.DELETE_PLAN, async () =>
    deletePlan({ planId: plan.id }),
  );

  useEventListener(EVENTS.TOGGLE_SETTINGS, () => setShowSettings(true));

  useEventListener(EVENTS.PRINT_PLAN, () => {
    if (isSaving) return;
    if (canPrint === true) {
      window.open(routes.planPrint({ planId: plan.displayId }));
    } else {
      document.getElementsByClassName("action-required")[0]?.scrollIntoView();
    }
  });

  useEffect(() => {
    plan.displayId > 0 && setTitle(`Plan de prise n°${plan.displayId}`);
  }, [plan.displayId, setTitle]);

  useEffect(() => {
    setOptions(
      ready && (medics ?? []).length > 0
        ? [
            {
              icon: isSaving ? "loading" : "checkCircle",
              className: cn(
                "plan-loading-state",
                isSaving
                  ? "animate-spin text-teal-900 plan-is-saving"
                  : "text-teal-600 plan-saved",
              ),
              path: "",
              tooltip: isSaving
                ? "⏳ Sauvegarde en cours"
                : "✅ Plan de prise sauvegardé",
            },
            {
              icon: isDeleting ? "loading" : "trash",
              className: "rounded-full bg-red-700 p-1 text-white",
              event: EVENTS.DELETE_PLAN,
              tooltip: "Supprimer le plan de prise",
            },
            {
              icon: "settings",
              className: cn(
                "rounded-full bg-orange-400 p-1 text-white plan-settings-button",
                {
                  "cursor-not-allowed bg-gray-600": plan.id === PLAN_NEW,
                },
              ),
              disabled: plan.id === PLAN_NEW,
              event: EVENTS.TOGGLE_SETTINGS,
            },
            {
              icon: "printer",
              className: cn("rounded-full bg-green-700 p-1 text-white", {
                "cursor-not-allowed bg-gray-600": canPrint !== true || isSaving,
              }),
              event: EVENTS.PRINT_PLAN,
              tooltip:
                !isSaving && canPrint === true
                  ? "Imprimer le plan de prise"
                  : !isSaving && typeof canPrint === "string"
                    ? canPrint
                    : "Vous ne pouvez pas imprimer actuellement",
            },
          ]
        : [],
    );
  }, [canPrint, isDeleting, isSaving, medics, plan.id, ready, setOptions]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <>
      <PlanSettings
        show={showSettings}
        setShow={() => setShowSettings(false)}
      />
      <div className="space-y-4">
        <form
          className="space-y-4"
          onChange={async () => {
            setIsSaving(true);
            saveDataDebounced.cancel();
            await saveDataDebounced({
              planId: usePlanStore.getState().id ?? "",
              data: usePlanStore.getState().data ?? {},
            });
          }}
        >
          {medics?.map((id) =>
            removingMedicsId.includes(id) ? (
              <CardLoading
                key={`plan_${plan.id}_${id}_removing`}
                denomination={
                  removingMedics.find((medic) => medic.id === id)
                    ?.denomination ?? ""
                }
                type="deleting"
              />
            ) : (
              <Card
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
                  await removeMedicAction({
                    planId: plan.id,
                    medicId: medicament.id,
                  })
                    .then(transformResponse)
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
                renderBody={(medicament) => (
                  <PlanCardBody medicament={medicament} />
                )}
              />
            ),
          )}
        </form>
        {addingMedics.map((row) => (
          <CardLoading
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
              await addMedicAction({
                planId: plan.id,
                medicId: value.id,
              })
                .then(transformResponse)
                .then((response) => {
                  if (plan.id === PLAN_NEW) {
                    if (typeof response === "object" && "id" in response) {
                      init(response);
                      router.replace(
                        routes.plan({ planId: response.displayId }),
                      );
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
          onInputChange={(value, action) => {
            switch (action.action) {
              case "input-change":
                if (value.length > 2) setSearchValueDebounced(value);
                break;
              case "menu-close":
                setSearchValue("");
                reset();
                break;
              case "set-value":
                setSearchValue("");
                reset();
                break;
            }
          }}
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
    </>
  );
};

export default PlanClient;
