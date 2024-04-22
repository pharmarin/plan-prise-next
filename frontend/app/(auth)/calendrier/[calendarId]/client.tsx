"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import {
  deleteCalendarAction,
  saveDataAction,
} from "@/app/(auth)/calendrier/actions";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import NavbarModule from "@/app/(auth)/modules-navbar";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import type { Calendar, Medicament, PrincipeActif } from "@prisma/client";
import { debounce } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { CALENDAR_NEW } from "@plan-prise/api/constants";
import errors from "@plan-prise/errors/errors.json";
import LoadingScreen from "@plan-prise/ui/components/pages/Loading";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";

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
  const isSaving = useCalendarStore((state) => state.isSaving);
  const canPrint = useCalendarStore((state) => !state.touched);
  const [calendarId, setCalendarId] = useState<string>(calendar.id);
  const [displayId, setDisplayId] = useState<number>(calendar.displayId);

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
      data: calendar.data ?? {},
    });
    setReady(true);
  }, [calendar.data, calendar.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveDataDebounced = useCallback(
    debounce(async (data: Parameters<typeof saveDataAction>["0"]) => {
      if (calendarId === CALENDAR_NEW && firstSavePending) {
        return undefined;
      }
      if (calendarId === CALENDAR_NEW) {
        setFirstSavePending(true);
      }

      const response = await saveDataAction(data)
        .then(transformResponse)
        .then(async (response) => {
          if (calendarId === CALENDAR_NEW) {
            if (typeof response === "object" && "id" in response) {
              setCalendarId(response.id);
              setDisplayId(response.displayId);
              useCalendarStore.setState({
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
      calendarId,
      data: useCalendarStore.getState().data ?? {},
    });
  };

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      <NavbarModule
        canPrint={canPrint}
        displayId={displayId}
        id={calendarId}
        isSaving={isSaving}
        medicsLength={medicamentIdArray.length}
        onDeleteAction={deleteCalendarAction}
        type="calendar"
      />
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
