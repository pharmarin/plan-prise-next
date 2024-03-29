import useCalendarStore, {
  emptyIteration,
} from "@/app/(auth)/calendrier/state";
import { addDays, differenceInDays } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@plan-prise/ui/button";
import DatePicker from "@plan-prise/ui/components/date-picker";
import { Input } from "@plan-prise/ui/input";
import { Label } from "@plan-prise/ui/label";

const CalendarCardBody = ({
  medicament,
}: {
  medicament: PP.Medicament.Include;
}) => {
  const data = useCalendarStore(
    useShallow((state) => state.data?.[medicament.id]),
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
      {(data && data?.length > 0 ? data : [emptyIteration()]).map(
        (iteration, index) => {
          const disabledBefore =
            index > 0
              ? addDays(data?.[index - 1]?.endDate ?? new Date(), 1)
              : new Date();

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
                  onClick={() => removeIteration(medicament.id, index)}
                  size="sm"
                  variant="destructive"
                >
                  <XIcon />
                </Button>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Date de début</Label>
                    <DatePicker
                      disabled={{ before: disabledBefore }}
                      onChange={(value) => {
                        value &&
                          setData(`${medicament.id}.${index}.startDate`, value);
                        value &&
                          iteration.endDate &&
                          value > iteration.endDate &&
                          setData(`${medicament.id}.${index}.endDate`, value);
                      }}
                      placeholder="Date de début"
                      value={iteration.startDate}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Date de fin</Label>
                    <DatePicker
                      daysFromDate={iteration.startDate}
                      disabled={{ before: iteration.startDate ?? new Date() }}
                      onChange={(value) =>
                        value &&
                        setData(`${medicament.id}.${index}.endDate`, value)
                      }
                      placeholder="Date de fin"
                      value={iteration.endDate}
                    />
                  </div>
                </div>
                {iteration.startDate && iteration.endDate && (
                  <p className="my-2 text-center text-sm font-semibold">
                    Soit{" "}
                    {differenceInDays(iteration.endDate, iteration.startDate) +
                      1}{" "}
                    jour(s)
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Quantité à administrer</Label>
                <Input
                  onChange={(event) =>
                    setData(
                      `${medicament.id}.${index}.quantity`,
                      event.currentTarget.value,
                    )
                  }
                  value={iteration.quantity}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Fréquence d&apos;administration</Label>
                <div className="flex items-center">
                  <Input
                    onChange={(event) =>
                      setData(
                        `${medicament.id}.${index}.frequency`,
                        event.currentTarget.value,
                      )
                    }
                    type="number"
                    value={iteration.frequency}
                  />
                  <span className="-ml-20">jours</span>
                </div>
              </div>
            </div>
          );
        },
      )}
      <button
        className="flex min-h-16 cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-4"
        onClick={() => pushEmptyIteration(medicament.id)}
      >
        <PlusIcon className="h-16 w-16 text-teal-500" />
      </button>
    </div>
  );
};

export default CalendarCardBody;
