"use client";

import { useEffect } from "react";
import Card from "@/app/_components/card";
import MedicamentSelect from "@/app/_components/select-medicament";
import CalendarCardBody from "@/app/(auth)/calendrier/[calendarId]/card-body";
import useCalendarStore from "@/app/(auth)/calendrier/state";
import type { Calendar } from "@prisma/client";

const CalendarClient = ({ calendar }: { calendar: Calendar }) => {
  const medicaments = useCalendarStore((state) =>
    Object.keys(state.data ?? {}),
  );
  const addMedic = useCalendarStore((state) => state.addMedic);

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
          removeMedic={() => void console.log()}
          renderBody={(medicament) => (
            <CalendarCardBody medicament={medicament} />
          )}
        />
      ))}
      <MedicamentSelect onChange={(value) => addMedic(value.id)} />
    </div>
  );
};

export default CalendarClient;
