"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import Card from "@/app/(auth)/modules-card";
import NavbarModule from "@/app/(auth)/modules-navbar";
import PlanCardBody from "@/app/(auth)/plan/[planId]/card-body";
import PlanSettings from "@/app/(auth)/plan/[planId]/settings";
import {
  deletePlanAction,
  findPrecautionsAction,
  savePlanDataAction,
} from "@/app/(auth)/plan/actions";
import {
  PLAN_NO_MEDIC_WARNING,
  PLAN_SETTINGS_DEFAULT,
} from "@/app/(auth)/plan/constants";
import usePlanStore from "@/app/(auth)/plan/state";
import MedicamentSelect from "@/app/modules-select-medicament";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import type { Plan } from "@prisma/client";
import { debounce, merge } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { PLAN_NEW } from "@plan-prise/api/constants";
import errors from "@plan-prise/errors/errors.json";
import LoadingScreen from "@plan-prise/ui/components/pages/Loading";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";

const PlanClient = ({
  medicaments,
  plan,
}: {
  medicaments: PP.Medicament.Include[];
  plan: Plan;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [showSettings, setShowSettings] = useState(false);
  const [firstSavePending, setFirstSavePending] = useState(false);

  const setIsSaving = usePlanStore((state) => state.setIsSaving);
  const medicIds = usePlanStore(
    useShallow((state) => Object.keys(state.data ?? {})),
  );
  const canPrint = usePlanStore((state) => state.canPrint);
  const isSaving = usePlanStore((state) => state.isSaving);
  const planId = usePlanStore((state) => state.id ?? "");
  const displayId = usePlanStore((state) => state.displayId ?? -1);

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
    debounce(async (data: Parameters<typeof savePlanDataAction>["0"]) => {
      if (planId === PLAN_NEW && firstSavePending) {
        if (firstSavePending) {
          return undefined;
        } else {
          setFirstSavePending(true);
        }
      }

      await savePlanDataAction(data)
        .then(transformResponse)
        .then(async (response) => {
          if (planId === PLAN_NEW) {
            if (typeof response === "object" && "id" in response) {
              usePlanStore.setState({
                id: response.id,
                displayId: response.displayId,
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
    usePlanStore.setState({
      id: plan.id,
      displayId: plan.displayId,
      data: plan.data ?? {},
      settings: merge(PLAN_SETTINGS_DEFAULT, plan.settings),
      canPrint:
        Object.keys(plan.data ?? {}).length > 0 ? true : PLAN_NO_MEDIC_WARNING,
    });
  }, [plan]);

  if (!planId) {
    return <LoadingScreen />;
  }

  return (
    <>
      <NavbarModule
        canPrint={canPrint}
        displayId={displayId}
        id={planId}
        isSaving={isSaving}
        medicsLength={(medicIds ?? []).length}
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
          {medicIds?.map((medicId) => (
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
            >
              {(medicament) => <PlanCardBody medicament={medicament} />}
            </Card>
          ))}
        </form>
        <MedicamentSelect
          onChange={async (value) => {
            if ((medicIds ?? []).includes(value.id)) {
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
