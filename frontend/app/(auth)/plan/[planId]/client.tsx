"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/_components/card";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import NavbarModule from "@/app/(auth)/modules-navbar";
import PlanCardBody from "@/app/(auth)/plan/[planId]/card-body";
import PlanSettings from "@/app/(auth)/plan/[planId]/settings";
import {
  deletePlanAction,
  findManyMedicsAction,
  findPrecautionsAction,
  saveDataAction,
} from "@/app/(auth)/plan/actions";
import usePlanStore from "@/app/(auth)/plan/state";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import type { Plan } from "@prisma/client";
import { debounce } from "lodash-es";
import type { SelectInstance } from "react-select";
import ReactSelect from "react-select";
import { useShallow } from "zustand/react/shallow";

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

const PlanClient = ({
  medicaments,
  plan,
}: {
  medicaments: PP.Medicament.Include[];
  plan: Plan;
}) => {
  const selectRef = useRef<SelectInstance<SelectValueType> | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [firstSavePending, setFirstSavePending] = useState(false);

  const { init, setIsSaving } = usePlanStore(
    useShallow((state) => ({
      init: state.init,
      addMedic: state.addMedic,
      removeMedic: state.removeMedic,
      setIsSaving: state.setIsSaving,
    })),
  );
  const medics = usePlanStore((state) => state.medics);
  const canPrint = usePlanStore((state) => state.canPrint);
  const isSaving = usePlanStore((state) => state.isSaving);
  const [planId, setPlanId] = useState<string>(plan.id);
  const [displayId, setDisplayId] = useState<number>(plan.displayId);

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

  const saveFormData = async () => {
    setIsSaving(true);
    saveDataDebounced.cancel();
    await saveDataDebounced({
      planId,
      data: usePlanStore.getState().data ?? {},
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveDataDebounced = useCallback(
    debounce(async (data: Parameters<typeof saveDataAction>["0"]) => {
      const currentId = usePlanStore.getState().id;

      if (currentId === PLAN_NEW && firstSavePending) {
        if (firstSavePending) {
          return undefined;
        } else {
          setFirstSavePending(true);
        }
      }

      await saveDataAction(data)
        .then(transformResponse)
        .then(async (response) => {
          if (currentId === PLAN_NEW) {
            if (typeof response === "object" && "id" in response) {
              setPlanId(response.id);
              setDisplayId(response.displayId);
              usePlanStore.setState({
                id: response.id,
                data: response.data ?? {},
              });
              router.replace(routes.plan({ planId: response.displayId }));
              await saveFormData();
            }

            if (firstSavePending) {
              setFirstSavePending(false);
            }
          }
        })
        .catch(() => {
          toast({
            title: `Impossible de mettre à jour le calendrier`,
            description: "Veuillez réessayer",
            variant: "destructive",
          });
        });

      setIsSaving(false);
    }, 2000),
    [],
  );

  const [{ data: precautions }] = useAsyncCallback(findPrecautionsAction);

  useEffect(() => {
    init(plan);
    setReady(true);
  }, [init, plan]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <>
      <NavbarModule
        canPrint={canPrint}
        displayId={displayId}
        id={planId}
        isSaving={isSaving}
        medicsLength={(medics ?? []).length}
        onDeleteAction={deletePlanAction}
        setShowSettings={setShowSettings}
        type="plan"
      />
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
              planId,
              data: usePlanStore.getState().data ?? {},
            });
          }}
        >
          {medics?.map((medicId) => (
            <Card
              key={`plan_${plan.id}_${medicId}`}
              medicamentId={medicId}
              medicamentData={
                isCuid(medicId)
                  ? medicaments.find((medicament) => medicament.id === medicId)
                  : {
                      id: medicId,
                      denomination: medicId,
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
                usePlanStore.setState((state) => {
                  if (state.data) {
                    const { [medicament.id]: _, ...data } = state.data;
                    state.data = data;
                  }
                });
                await saveFormData();
              }}
              renderBody={(medicament) => (
                <PlanCardBody medicament={medicament} />
              )}
            />
          ))}
        </form>
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
              if (medics?.includes(value.id)) {
                toast({
                  title: errors.PLAN_MEDICAMENT_ALREADY_ADDED_ERROR,
                  variant: "destructive",
                });
                return;
              }
              usePlanStore.setState((state) => {
                if (state.data) {
                  state.data[value.id] = {};
                }
              });
              await saveFormData();
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
