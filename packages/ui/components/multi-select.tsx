"use client";

import { useState } from "react";
import { CommandLoading } from "cmdk";
import { CheckIcon, ChevronDown, X } from "lucide-react";

import { cn } from "../shadcn/lib/utils";
import { Badge } from "../shadcn/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "../shadcn/ui/command";
import { FormControl } from "../shadcn/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";

const MultiSelect = <
  Value extends string,
  Label extends string,
  Option extends Record<Value | Label, string>,
>({
  defaultValue,
  disabled,
  keys,
  onSelect,
  placeholder,
  searchPlaceholder,
  ...props
}: {
  defaultValue?: Option[];
  disabled?: boolean;
  keys: {
    value: Value;
    label: Label;
  };
  onSelect: (values: Option[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
} & (
  | { options: Option[] }
  | { onSearchChange: (value: string) => Promise<Option[]> }
)) => {
  const [selectOptions, setSelectOptions] = useState<Option[]>(
    "options" in props ? props.options : [],
  );
  const [selectedValues, setSelectedValues] = useState(
    () => new Set<Option>(defaultValue),
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Popover open={disabled ? false : undefined}>
      <PopoverTrigger asChild>
        <FormControl>
          <div
            className={cn(
              "relative flex min-h-[36px] items-center justify-end rounded-md border data-[state=open]:border-ring",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <div className="relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden px-3 py-1">
              {selectedValues?.size > 0 ? (
                [...selectedValues].map((option) => (
                  <Badge
                    key={option[keys.value]}
                    variant="outline"
                    className="m-[2px] gap-1 pr-0.5"
                  >
                    <span className="">{option[keys.label]}</span>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        if (disabled) return;
                        setSelectedValues((prev) => {
                          const next = new Set(prev);
                          next.delete(option);
                          return next;
                        });
                      }}
                      className="flex items-center rounded-sm px-[1px] hover:bg-accent hover:text-red-500"
                    >
                      <X size={14} />
                    </span>
                  </Badge>
                ))
              ) : (
                <span className="mr-auto text-sm">{placeholder}</span>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center self-stretch px-1 text-muted-foreground/60">
              {selectedValues?.size > 0 && (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    if (disabled) return;
                    setSelectedValues(new Set());
                  }}
                  className="flex items-center self-stretch p-2 hover:text-red-500"
                >
                  <X size={16} />
                </div>
              )}
              <span className="mx-0.5 my-2 w-[1px] self-stretch bg-border" />
              <div className="flex items-center self-stretch p-2 hover:text-muted-foreground">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={async (value) => {
              if (!("onSearchChange" in props)) return;

              setIsLoading(true);
              setSelectOptions(await props.onSearchChange(value));
              setIsLoading(false);
            }}
            placeholder={searchPlaceholder}
            className="h-9"
          />
          {isLoading && (
            <CommandLoading>Chargement en cours... </CommandLoading>
          )}
          {selectOptions.length === 0 && (
            <CommandEmpty>Aucun résultat...</CommandEmpty>
          )}
          {selectOptions.map((option) => {
            const isSelected = selectedValues.has(option);
            return (
              <CommandItem
                key={option[keys.value]}
                onSelect={() => {
                  if (isSelected) {
                    selectedValues.delete(option);
                  } else {
                    selectedValues.add(option);
                  }
                  const filterValues = Array.from(selectedValues);
                  onSelect(filterValues);
                }}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <CheckIcon className={cn("h-4 w-4")} />
                </div>
                <span>{option[keys.label]}</span>
              </CommandItem>
            );
          })}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
