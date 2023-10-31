"use client";

import { useConservation } from "@/app/(auth)/plan/_lib/hooks";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Medicament } from "@prisma/client";
import { useEffect } from "react";

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
        `Veuillez choisir une durée de conservation pour ${medicament.denomination}`
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
                value={conservationDuree.laboratoire || ""}
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
