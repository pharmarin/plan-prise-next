"use client";

import { useCallback, useEffect, useState } from "react";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import { deleteAction, saveDataAction } from "@/app/(auth)/calendrier/actions";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import { useNavigationState } from "@/app/state-navigation";
import { useEventListener } from "@/utils/event-listener";
import { isCuid } from "@paralleldrive/cuid2";
import type { Calendar, Medicament, PrincipeActif } from "@prisma/client";
import { debounce } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import errors from "@plan-prise/errors/errors.json";
import LoadingScreen from "@plan-prise/ui/components/pages/Loading";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

enum EVENTS {
  DELETE_CALENDAR = "DELETE_CALENDAR",
  PRINT_CALENDAR = "PRINT_CALENDAR",
}

const CalendarClient = ({
  calendar,
  medicaments,
}: {
  calendar: Calendar;
  medicaments?: (Medicament & { principesActifs: PrincipeActif[] })[];
}) => {
  const { toast } = useToast();

  const [ready, setReady] = useState(false);

  const data = useCalendarStore((state) => state.data);
  const medicamentIdArray = Object.keys(data ?? {});

  const { addMedic, removeMedic, setIsSaving } = useCalendarStore(
    useShallow((state) => ({
      addMedic: state.addMedic,
      removeMedic: state.removeMedic,
      setIsSaving: state.setIsSaving,
    })),
  );

  useEffect(() => {
    // Init state with server component data when mounted
    useCalendarStore.setState({
      id: calendar.id,
      data: calendar.data ?? {},
    });
    setReady(true);
  }, [calendar.data, calendar.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveDataDebounced = useCallback(
    debounce(async (data: Parameters<typeof saveDataAction>["0"]) => {
      await saveDataAction(data);
      setIsSaving(false);
    }, 2000),
    [],
  );

  const saveFormData = async () => {
    setIsSaving(true);
    saveDataDebounced.cancel();
    await saveDataDebounced({
      calendarId: useCalendarStore.getState().id ?? "",
      data: useCalendarStore.getState().data ?? {},
    });
  };

  /* NAVBAR */

  const { setOptions, setTitle } = useNavigationState(
    useShallow((state) => ({
      setOptions: state.setOptions,
      setTitle: state.setTitle,
    })),
  );
  const isSaving = useCalendarStore((state) => state.isSaving);

  const [{ isLoading: isDeleting }, deletePlan] =
    useAsyncCallback(deleteAction);

  useEventListener(EVENTS.DELETE_CALENDAR, async () =>
    deletePlan({ calendarId: calendar.id }),
  );

  useEffect(() => {
    setOptions(
      ready && (medicamentIdArray ?? []).length > 0
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
              event: EVENTS.DELETE_CALENDAR,
              tooltip: "Supprimer le plan de prise",
            },
            /* {
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
            }, */
          ]
        : [],
    );
  }, [isDeleting, isSaving, medicamentIdArray, ready, setOptions]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      <form className="space-y-4" onChange={saveFormData}>
        {medicamentIdArray.map((medicId) => (
          <Card
            key={`calendar_${calendar.id}_${medicId}`}
            medicamentId={medicId}
            medicamentData={
              isCuid(medicId)
                ? (medicaments?.find(
                    (medicament) => medicament.id === medicId,
                  ) as PP.Medicament.Include)
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
            removeMedic={async () => {
              removeMedic(medicId);
              await saveFormData();
            }}
            renderBody={(medicament) => (
              <CalendarCardBody
                medicament={medicament}
                onInputChange={saveFormData}
              />
            )}
          />
        ))}
      </form>
      <MedicamentSelect
        onChange={async (value) => {
          if (medicamentIdArray.includes(value.id)) {
            toast({
              title: errors.CALENDAR_MEDICAMENT_ALREADY_ADDED_ERROR,
              variant: "destructive",
            });
            return;
          }
          addMedic(value.id);
          await saveFormData();
        }}
      />
    </div>
  );
};

export default CalendarClient;
