"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import NavbarModule from "@/app/(auth)/modules-navbar";
import PlanCardBody from "@/app/(auth)/plan/[planId]/card-body";
import PlanSettings from "@/app/(auth)/plan/[planId]/settings";
import {
  deletePlanAction,
  findPrecautionsAction,
  saveDataAction,
} from "@/app/(auth)/plan/actions";
import usePlanStore from "@/app/(auth)/plan/state";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import type { Plan } from "@prisma/client";
import { debounce } from "lodash-es";
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
  const medicIds = usePlanStore((state) => state.medics);
  const canPrint = usePlanStore((state) => state.canPrint);
  const isSaving = usePlanStore((state) => state.isSaving);
  const [planId, setPlanId] = useState<string>(plan.id);
  const [displayId, setDisplayId] = useState<number>(plan.displayId);

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
      if (planId === PLAN_NEW && firstSavePending) {
        if (firstSavePending) {
          return undefined;
        } else {
          setFirstSavePending(true);
        }
      }

      await saveDataAction(data)
        .then(transformResponse)
        .then(async (response) => {
          if (planId === PLAN_NEW) {
            if (typeof response === "object" && "id" in response) {
              setPlanId(response.id);
              setDisplayId(response.displayId);
              usePlanStore.setState({
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
              renderBody={(medicament) => (
                <PlanCardBody medicament={medicament} />
              )}
            />
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
