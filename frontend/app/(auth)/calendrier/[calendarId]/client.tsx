"use client";

import { useEffect } from "react";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import type { Calendar } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";

import errors from "@plan-prise/errors/errors.json";
import { useToast } from "@plan-prise/ui/shadcn/hooks/use-toast";

const CalendarClient = ({ calendar }: { calendar: Calendar }) => {
  const { toast } = useToast();

  const data = useCalendarStore((state) => state.data);
  const medicaments = Object.keys(data ?? {});

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
      {medicaments.map((medicId) => (
        <Card
          key={`calendar_${calendar.id}_${medicId}`}
          medicamentId={medicId}
          removeMedic={() => removeMedic(medicId)}
          renderBody={(medicament) => (
            <CalendarCardBody medicament={medicament} />
          )}
        />
      ))}
      <MedicamentSelect
        onChange={(value) => {
          if (medicaments.includes(value.id)) {
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
