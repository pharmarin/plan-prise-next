import { extractPosologie } from "@/app/(auth)/plan/functions";
import usePlanStore from "@/app/(auth)/plan/state";
import { PlanPrisePosologies } from "@/types/plan";
import type { Medicament } from "@prisma/client";

import { FormItem } from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";
import { Label } from "@plan-prise/ui/shadcn/ui/label";

const PlanPosologie = ({
  medicament,
  name,
}: {
  medicament: Medicament;
  name: keyof typeof PlanPrisePosologies;
}) => {
  const data = usePlanStore(
    (state) => state.data?.[medicament.id]?.posologies?.[name],
  );
  const setData = usePlanStore((state) => state.setData);

  return (
    <FormItem className="w-full">
      <Label>{PlanPrisePosologies[name]}</Label>
      <Input
        onChange={(event) =>
          setData(
            `${medicament.id}.posologies.${name}`,
            event.currentTarget.value,
          )
        }
        value={extractPosologie(data)}
      />
    </FormItem>
  );
};

export default PlanPosologie;
