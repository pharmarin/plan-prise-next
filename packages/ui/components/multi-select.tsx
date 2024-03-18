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
  CommandList,
} from "../shadcn/ui/command";
import { FormControl } from "../shadcn/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";

const MultiSelect = <
  Value extends string,
  Label extends string,
  Option extends Record<Value | Label, string>,
>({
  disabled,
  keys,
  onChange,
  placeholder,
  searchPlaceholder,
  values,
  ...props
}: {
  disabled?: boolean;
  keys: {
    value: Value;
    label: Label;
  };
  onChange: (values: Option[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  values: Option[];
} & (
  | { options: Option[] }
  | { onSearchChange: (value: string) => Promise<Option[]> }
)) => {
  const [selectOptions, setSelectOptions] = useState<Option[]>(
    "options" in props ? props.options : [],
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
              {(values ?? []).length > 0 ? (
                [...values].map((option) => (
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
                        onChange(
                          values.filter(
                            (value) => value[keys.value] !== option[keys.value],
                          ),
                        );
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
              {(values ?? []).length > 0 && (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    if (disabled) return;
                    onChange([]);
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
          <CommandList>
            {isLoading && (
              <CommandLoading>Chargement en cours... </CommandLoading>
            )}
            {selectOptions.length === 0 && (
              <CommandEmpty>Aucun résultat...</CommandEmpty>
            )}
            {selectOptions.map((option) => {
              const isSelected = !!values.find(
                (value) => value[keys.value] === option[keys.value],
              );
              return (
                <CommandItem
                  key={option[keys.value]}
                  onSelect={() => {
                    if (isSelected) {
                      onChange(
                        values.filter(
                          (value) => value[keys.value] !== option[keys.value],
                        ),
                      );
                    } else {
                      onChange([...values, option]);
                    }
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
