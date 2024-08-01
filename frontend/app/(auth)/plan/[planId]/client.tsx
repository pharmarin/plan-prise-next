"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import Card from "@/app/(auth)/modules-card";
import NavbarModule from "@/app/(auth)/modules-navbar";
import PlanCardBody from "@/app/(auth)/plan/[planId]/card-body";
import PlanSettings from "@/app/(auth)/plan/[planId]/settings";
import {
  deletePlanAction,
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

import { NEW } from "@plan-prise/api/constants";
import errors from "@plan-prise/errors/errors.json";
import LoadingScreen from "@plan-prise/ui/components/pages/Loading";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";

const PlanClient = ({
  medicaments,
  plan,
}: {
  medicaments?: PP.Medicament.Include[];
  plan: Plan & { data: PP.Plan.Data1 };
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [showSettings, setShowSettings] = useState(false);
  const [firstSavePending, setFirstSavePending] = useState(false);

  const setIsSaving = usePlanStore((state) => state.setIsSaving);
  const medicIds = usePlanStore(
    useShallow((state) => (state.data ?? []).map((row) => row.medicId)),
  );
  const canPrint = usePlanStore((state) => state.canPrint);
  const isSaving = usePlanStore((state) => state.isSaving);
  const planId = usePlanStore((state) => state.id);
  const displayId = usePlanStore((state) => state.displayId);

  const saveFormData = async () => {
    setIsSaving(true);
    saveDataDebounced.cancel();
    await saveDataDebounced();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveDataDebounced = useCallback(
    debounce(async () => {
      if (usePlanStore.getState().id === NEW && firstSavePending) {
        if (firstSavePending) {
          return undefined;
        } else {
          setFirstSavePending(true);
        }
      }

      await savePlanDataAction({
        planId: usePlanStore.getState().id ?? "",
        data: usePlanStore.getState().data ?? [],
      })
        .then(transformResponse)
        .then(async (response) => {
          const currentId = usePlanStore.getState().id;

          if (currentId === NEW) {
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
            title: `Impossible de mettre à jour le plan de prise`,
            description: "Veuillez réessayer",
            variant: "destructive",
          });
        });

      setIsSaving(false);
    }, 2000),
    [],
  );

  useEffect(() => {
    usePlanStore.setState({
      id: plan.id,
      displayId: plan.displayId,
      data: plan.data ?? {},
      settings: merge(PLAN_SETTINGS_DEFAULT, plan.settings),
      canPrint: plan.data.length > 0 ? true : PLAN_NO_MEDIC_WARNING,
    });
  }, [plan]);

  if (!planId) {
    return <LoadingScreen />;
  }

  return (
    <>
      <NavbarModule
        canPrint={canPrint}
        displayId={displayId ?? -1}
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
        <form className="space-y-4" onChange={async () => await saveFormData()}>
          {medicIds?.map((medicId) => (
            <Card
              key={`plan_${planId}_${medicId}`}
              medicamentId={medicId}
              medicamentData={
                isCuid(medicId)
                  ? medicaments?.find((medicament) => medicament.id === medicId)
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
                    state.data = state.data.filter(
                      (row) => row.medicId !== medicament.id,
                    );
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
                state.data.push({
                  medicId: value.id,
                  data: {},
                });
              }
            });
            await saveFormData();
          }}
        />
      </div>
    </>
  );
};

export default PlanClient;
