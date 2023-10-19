import { extractPosologie, parseData } from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanPrisePosologies } from "@/types/plan";
import type { Medicament } from "@prisma/client";

const PlanPosologie = ({
  medicament,
  name,
}: {
  medicament: Medicament;
  name: keyof typeof PlanPrisePosologies;
}) => {
  const data = usePlanStore(
    (state) => parseData(state.data)?.[medicament.id]?.posologies?.[name],
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
