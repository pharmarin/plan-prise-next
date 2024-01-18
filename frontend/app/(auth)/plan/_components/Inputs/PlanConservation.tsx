"use client";

import { useEffect } from "react";
import { useConservation } from "@/app/(auth)/plan/hooks";
import usePlanStore from "@/app/(auth)/plan/state";
import type { Medicament } from "@prisma/client";

import { cn } from "@plan-prise/ui/shadcn/lib/utils";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import { FormItem } from "@plan-prise/ui/shadcn/ui/form";
import { Label } from "@plan-prise/ui/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plan-prise/ui/shadcn/ui/select";

const PlanConservation = ({ medicament }: { medicament: Medicament }) => {
  const { setData, unsetData, setCanPrint } = usePlanStore((state) => ({
    setData: state.setData,
    unsetData: state.unsetData,
    setCanPrint: state.setCanPrint,
  }));

  const conservationDuree = useConservation(medicament);

  useEffect(() => {
    if (conservationDuree.values.length > 1) {
      setCanPrint(
        `Veuillez choisir une durée de conservation pour ${medicament.denomination}`,
      );
    }
  }, [conservationDuree.values.length, medicament.denomination, setCanPrint]);

  if (conservationDuree.values.length === 0) {
    return undefined;
  }

  return (
    <FormItem
      className={cn({ "action-required": conservationDuree.values.length > 1 })}
    >
      <Label>Durée de conservation après ouverture</Label>
      {conservationDuree.values.length === 1 ? (
        <div>
          <p className="text-sm text-gray-900">
            {conservationDuree.values[0]?.duree}
          </p>
          {conservationDuree.custom && (
            <div className="flex space-x-2">
              <span className="text-sm italic text-gray-900">
                Pour {conservationDuree.values[0]?.laboratoire}
              </span>
              <Button
                className="p-0"
                onClick={() => unsetData(`${medicament.id}.conservation`)}
                variant="link"
              >
                Changer de laboratoire
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Select
          onValueChange={(value) => {
            setData(`${medicament.id}.conservation`, value);
            setCanPrint(true);
          }}
        >
          <SelectTrigger className="border-destructive shadow shadow-destructive">
            <SelectValue placeholder="Choisissez un laboratoire" />
          </SelectTrigger>
          <SelectContent>
            {conservationDuree.values.map((conservationDuree, index) => (
              <SelectItem
                key={index}
                value={conservationDuree.laboratoire ?? ""}
              >
                {conservationDuree.laboratoire}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default PlanConservation;
