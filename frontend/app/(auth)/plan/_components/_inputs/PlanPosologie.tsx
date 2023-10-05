import usePlanStore, { parseData } from "@/app/(auth)/plan/[id]/state";
import { extractPosologie } from "@/app/(auth)/plan/_lib/functions";
import TextInput from "@/components/forms/inputs/TextInput";
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
    <TextInput
      label={PlanPrisePosologies[name]}
      onChange={(event) =>
        setData(
          `${medicament.id}.posologies.${name}`,
          event.currentTarget.value,
        )
      }
      value={extractPosologie(data)}
    />
  );
};

export default PlanPosologie;
