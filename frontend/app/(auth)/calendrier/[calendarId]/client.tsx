"use client";

import { useEffect } from "react";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import { isCuid } from "@paralleldrive/cuid2";
import type { Calendar, Medicament, PrincipeActif } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";

import errors from "@plan-prise/errors/errors.json";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";

const CalendarClient = ({
  calendar,
  medicaments,
}: {
  calendar: Calendar;
  medicaments?: (Medicament & { principesActifs: PrincipeActif[] })[];
}) => {
  const { toast } = useToast();

  const data = useCalendarStore((state) => state.data);
  const medicamentIdArray = Object.keys(data ?? {});

  const { addMedic, removeMedic } = useCalendarStore(
    useShallow((state) => ({
      addMedic: state.addMedic,
      removeMedic: state.removeMedic,
    })),
  );

  useEffect(() => {
    useCalendarStore.setState({
      id: calendar.id,
      data: calendar.data ?? {},
    });
  }, [calendar.data, calendar.id]);

  return (
    <div className="space-y-4">
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
          removeMedic={() => removeMedic(medicId)}
          renderBody={(medicament) => (
            <CalendarCardBody medicament={medicament} />
          )}
        />
      ))}
      <MedicamentSelect
        onChange={(value) => {
          if (medicamentIdArray.includes(value.id)) {
            toast({
              title: errors.CALENDAR_MEDICAMENT_ALREADY_ADDED_ERROR,
              variant: "destructive",
            });
            return;
          }
          addMedic(value.id);
        }}
      />
    </div>
  );
};

export default CalendarClient;
