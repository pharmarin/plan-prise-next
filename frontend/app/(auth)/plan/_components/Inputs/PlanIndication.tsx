"use client";

import { useIndication } from "@/app/(auth)/plan/_lib/hooks";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const PlanIndication = ({ medicament }: { medicament: Medicament }) => {
  const { setData, setCanPrint } = usePlanStore((state) => ({
    setData: state.setData,
    setCanPrint: state.setCanPrint,
  }));

  const extracted = useIndication(medicament);

  useEffect(() => {
    if (extracted.length > 1) {
      setCanPrint(
        `Veuillez choisir une indication pour ${medicament.denomination}`,
      );
    }
  }, [extracted.length, medicament.denomination, setCanPrint]);

  return (
    <FormItem className={cn({ "action-required": extracted.length > 1 })}>
      <Label>Indication</Label>
      {extracted.length === 1 ? (
        <Input
          onChange={(event) =>
            setData(`${medicament.id}.indication`, event.currentTarget.value)
          }
          value={extracted[0]}
        />
      ) : (
        <Select
          onValueChange={(value) => {
            setData(`${medicament.id}.indication`, value);
            setCanPrint(true);
          }}
        >
          <SelectTrigger className="border-destructive shadow shadow-destructive">
            <SelectValue placeholder="Choisissez une indication" />
          </SelectTrigger>
          <SelectContent>
            {extracted.map((indication) => (
              <SelectItem key={indication} value={indication}>
                {indication}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default PlanIndication;
