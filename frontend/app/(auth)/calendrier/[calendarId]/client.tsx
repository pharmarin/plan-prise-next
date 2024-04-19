"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import { deleteAction, saveDataAction } from "@/app/(auth)/calendrier/actions";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import { routes } from "@/app/routes-schema";
import { useNavigationState } from "@/app/state-navigation";
import { useEventListener } from "@/utils/event-listener";
import { isCuid } from "@paralleldrive/cuid2";
import type { Calendar, Medicament, PrincipeActif } from "@prisma/client";
import { debounce } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { CALENDAR_NEW } from "@plan-prise/api/constants";
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
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [firstSavePending, setFirstSavePending] = useState(false);

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
      const currentId = useCalendarStore.getState().id;

      if (currentId === CALENDAR_NEW && firstSavePending) {
        return undefined;
      }
      if (currentId === CALENDAR_NEW) {
        setFirstSavePending(true);
      }

      const response = await saveDataAction(data)
        .then(transformResponse)
        .then(async (response) => {
          if (currentId === CALENDAR_NEW) {
            if (typeof response === "object" && "id" in response) {
              useCalendarStore.setState({
                id: response.id,
                data: response.data ?? {},
              });
              router.replace(
                routes.calendar({ calendarId: response.displayId }),
              );
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
      return response;
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
  const canPrint = useCalendarStore((state) => !state.touched);

  const [{ isLoading: isDeleting }, deleteCalendar] =
    useAsyncCallback(deleteAction);

  useEventListener(EVENTS.DELETE_CALENDAR, async () =>
    deleteCalendar({ calendarId: calendar.id }),
  );

  useEventListener(EVENTS.PRINT_CALENDAR, () => {
    if (isSaving) return;
    if (canPrint === true) {
      window.open(routes.calendarPrint({ calendarId: calendar.displayId }));
    }
  });

  useEffect(() => {
    calendar.displayId > 0 && setTitle(`Calendrier n°${calendar.displayId}`);
  }, [calendar.displayId, setTitle]);

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
            {
              icon: "printer",
              className: cn("rounded-full bg-green-700 p-1 text-white", {
                "cursor-not-allowed bg-gray-600": canPrint !== true || isSaving,
              }),
              event: EVENTS.PRINT_CALENDAR,
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
  }, [canPrint, isDeleting, isSaving, medicamentIdArray, ready, setOptions]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      <form className="space-y-4">
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
