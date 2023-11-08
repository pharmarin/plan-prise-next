import { extractPosologie } from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Medicament } from "@prisma/client";

const PlanPosologie = ({
  medicament,
  name,
}: {
  medicament: Medicament;
  name: keyof typeof PrismaJson.Plan.PlanPrisePosologies;
}) => {
  const data = usePlanStore(
    (state) => state.data?.[medicament.id]?.posologies?.[name],
  );
  const setData = usePlanStore((state) => state.setData);

  return (
    <FormItem className="w-full">
      <Label>{PrismaJson.Plan.PlanPrisePosologies[name]}</Label>
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
