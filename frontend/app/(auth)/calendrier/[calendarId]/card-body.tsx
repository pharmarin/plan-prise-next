import useCalendarStore from "@/app/(auth)/calendrier/state";
import { toYYYYMMDD } from "@/app/(auth)/calendrier/utils";
import { addDays, differenceInDays } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@plan-prise/ui/button";
import DatePicker from "@plan-prise/ui/components/date-picker";
import { Input } from "@plan-prise/ui/input";
import { Label } from "@plan-prise/ui/label";

const CalendarCardBody = ({
  medicament,
  onInputChange,
}: {
  medicament: PP.Medicament.Include;
  onInputChange: () => void;
}) => {
  const data = useCalendarStore(
    useShallow(
      (state) =>
        state.data?.find((row) => row.medicId === medicament.id)?.data ?? [],
    ),
  );
  const { setData, pushEmptyIteration, removeIteration } = useCalendarStore(
    useShallow((state) => ({
      setData: state.setData,
      pushEmptyIteration: state.pushEmptyIteration,
      removeIteration: state.removeIteration,
    })),
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {(data.length > 0 ? data : []).map((iteration, index) => {
        const previousIterationEndDate = data?.[index - 1]?.endDate;
        const disabledBefore =
          index > 0
            ? addDays(
                previousIterationEndDate
                  ? new Date(previousIterationEndDate)
                  : new Date(),
                1,
              )
            : undefined;

        if (iteration === undefined) {
          return null;
        }

        return (
          <div
            key={index}
            className="relative space-y-4 rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center space-x-4">
              <Button
                className="absolute right-4 top-4 h-6 w-6 rounded-full p-0"
                onClick={() => {
                  removeIteration(medicament.id, index);
                  onInputChange();
                }}
                size="sm"
                type="button"
                variant="destructive"
              >
                <XIcon />
              </Button>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label>Date de début</Label>
                  <DatePicker
                    disabled={disabledBefore && { before: disabledBefore }}
                    onChange={(value) => {
                      value &&
                        setData(
                          medicament.id,
                          `${index}.startDate`,
                          toYYYYMMDD(value),
                        );
                      value &&
                        value > new Date(iteration.endDate) &&
                        setData(
                          medicament.id,
                          `${index}.endDate`,
                          toYYYYMMDD(value),
                        );
                      onInputChange();
                    }}
                    placeholder="Date de début"
                    value={
                      iteration.startDate
                        ? new Date(iteration.startDate)
                        : disabledBefore
                    }
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Date de fin</Label>
                  <DatePicker
                    daysFromDate={
                      iteration.startDate
                        ? new Date(iteration.startDate)
                        : undefined
                    }
                    disabled={{
                      before: iteration.startDate
                        ? new Date(iteration.startDate)
                        : new Date(),
                    }}
                    onChange={(value) => {
                      value &&
                        setData(
                          medicament.id,
                          `${index}.endDate`,
                          toYYYYMMDD(value),
                        );
                      onInputChange();
                    }}
                    placeholder="Date de fin"
                    value={
                      iteration.endDate
                        ? new Date(iteration.endDate)
                        : disabledBefore
                    }
                  />
                </div>
              </div>
              {iteration.startDate && iteration.endDate && (
                <p className="my-2 text-center text-sm font-semibold">
                  Soit{" "}
                  {differenceInDays(
                    new Date(iteration.endDate),
                    new Date(iteration.startDate),
                  ) + 1}{" "}
                  jour(s)
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Quantité à administrer</Label>
              <Input
                onChange={(event) => {
                  setData(
                    medicament.id,
                    `${index}.quantity`,
                    event.currentTarget.value,
                  );
                  onInputChange();
                }}
                value={iteration.quantity ?? 1}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Fréquence d&apos;administration</Label>
              <div className="flex items-center">
                <Input
                  onChange={(event) => {
                    setData(
                      medicament.id,
                      `${index}.frequency`,
                      event.currentTarget.value,
                    );
                    onInputChange();
                  }}
                  type="number"
                  value={iteration.frequency ?? 1}
                />
                <span className="-ml-20">jours</span>
              </div>
            </div>
          </div>
        );
      })}
      <button
        className="flex min-h-16 cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-4"
        onClick={() => pushEmptyIteration(medicament.id)}
        type="button"
      >
        <PlusIcon className="h-16 w-16 text-teal-500" />
      </button>
    </div>
  );
};

export default CalendarCardBody;
