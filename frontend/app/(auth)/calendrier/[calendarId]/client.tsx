"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import {
  deleteCalendarAction,
  saveDataAction,
} from "@/app/(auth)/calendrier/actions";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import Card from "@/app/(auth)/modules-card";
import NavbarModule from "@/app/(auth)/modules-navbar";
import MedicamentSelect from "@/app/modules-select-medicament";
import { routes } from "@/app/routes-schema";
import { isCuid } from "@paralleldrive/cuid2";
import type { Calendar, Medicament, PrincipeActif } from "@prisma/client";
import { debounce } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { NEW } from "@plan-prise/api/constants";
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

  const [firstSavePending, setFirstSavePending] = useState(false);

  const medicIds = useCalendarStore(
    useShallow((state) => (state.data ?? []).map((row) => row.medicId)),
  );
  const isSaving = useCalendarStore((state) => state.isSaving);
  const canPrint = useCalendarStore((state) => !state.touched);
  const calendarId = useCalendarStore((state) => state.id);
  const displayId = useCalendarStore((state) => state.displayId);

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
      displayId: calendar.displayId,
      data: calendar.data ?? [],
    });
  }, [calendar]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveDataDebounced = useCallback(
    debounce(async () => {
      if (useCalendarStore.getState().id === NEW) {
        if (firstSavePending) {
          return undefined;
        }
        setFirstSavePending(true);
      }

      const response = await saveDataAction({
        calendarId: useCalendarStore.getState().id ?? "",
        data: useCalendarStore.getState().data ?? [],
      })
        .then(transformResponse)
        .then(async (response) => {
          const currentId = useCalendarStore.getState().id;

          if (currentId === NEW) {
            if (typeof response === "object" && "id" in response) {
              useCalendarStore.setState({
                id: response.id,
                displayId: response.displayId,
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
    await saveDataDebounced();
  };

  if (!calendarId) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      <NavbarModule
        canPrint={canPrint}
        displayId={displayId ?? -1}
        id={calendarId}
        isSaving={isSaving}
        medicsLength={medicIds.length}
        onDeleteAction={deleteCalendarAction}
        type="calendar"
      />
      <form className="space-y-4">
        {medicIds.map((medicId) => (
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
          >
            {(medicament) => (
              <CalendarCardBody
                medicament={medicament}
                onInputChange={saveFormData}
              />
            )}
          </Card>
        ))}
      </form>
      <MedicamentSelect
        onChange={async (value) => {
          if (medicIds.includes(value.id)) {
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
