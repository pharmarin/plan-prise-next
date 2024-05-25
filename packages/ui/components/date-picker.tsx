"use client";

import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { cn } from "../shadcn/lib/utils";
import { Button } from "../shadcn/ui/button";
import { Calendar } from "../shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";

const DatePicker = ({
  daysFromDate,
  disabled,
  inputClassName,
  onChange,
  placeholder,
  value,
}: {
  daysFromDate?: Date;
  disabled?: Matcher | Matcher[] | undefined;
  inputClassName?: string;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  value?: Date;
}) => {
  const [open, setOpen] = useState(false);
  const [hoveredDays, setHoveredDays] = useState<number>();

  if (!value) {
    value = new Date();
  }

  return (
    <div>
      <Popover
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          setHoveredDays(undefined);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              inputClassName,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "PPP", { locale: fr })
            ) : (
              <span>{placeholder ?? "Choisissez une date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {placeholder && (
            <p className="mt-2 text-center text-sm font-semibold">
              {placeholder}
            </p>
          )}
          <Calendar
            defaultMonth={value}
            disabled={disabled}
            mode="single"
            numberOfMonths={2}
            onDayPointerEnter={(day) => {
              if (daysFromDate && day >= daysFromDate) {
                setHoveredDays(differenceInDays(day, daysFromDate) + 2);
              } else {
                setHoveredDays(undefined);
              }
            }}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            selected={value}
          />
          {daysFromDate && (
            <p className="my-2 text-center text-sm font-semibold">
              Sélection : {hoveredDays && `${hoveredDays} jours`}
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
