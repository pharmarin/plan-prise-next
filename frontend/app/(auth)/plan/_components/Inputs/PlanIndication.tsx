import { extractIndication, parseData } from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import Select from "@/components/forms/inputs/Select";
import TextInput from "@/components/forms/inputs/TextInput";
import type { Medicament } from "@prisma/client";
import type { ChangeEvent } from "react";

const NOT_SET = "NOT_SET";

const PlanIndication = ({ medicament }: { medicament: Medicament }) => {
  const data = usePlanStore(
    (state) => parseData(state.data)?.[medicament.id]?.indication,
  );
  const setData = usePlanStore((state) => state.setData);

  const extracted = extractIndication(medicament, data);

  if (extracted.length === 1) {
    return (
      <TextInput
        label="Indication"
        onChange={(event) =>
          setData(`${medicament.id}.indication`, event.currentTarget.value)
        }
        value={extracted}
      />
    );
  }

  return (
    <Select
      label="Indication"
      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
        setData(`${medicament.id}.indication`, event.currentTarget.value)
      }
      value={NOT_SET}
    >
      <option value={NOT_SET} disabled={true}>
        Choisissez une indication
      </option>
      {extracted.map((indication) => (
        <option key={indication} className="font-sans" value={indication}>
          {indication}
        </option>
      ))}
    </Select>
  );
};

export default PlanIndication;
