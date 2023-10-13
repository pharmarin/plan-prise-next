"use client";

import { useIndication } from "@/app/(auth)/plan/_lib/hooks";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import Select from "@/components/forms/inputs/Select";
import TextInput from "@/components/forms/inputs/TextInput";
import type { Medicament } from "@prisma/client";
import { useEffect, type ChangeEvent } from "react";

const NOT_SET = "NOT_SET";

const PlanIndication = ({ medicament }: { medicament: Medicament }) => {
  const { setData, setCanPrint } = usePlanStore((state) => ({
    setData: state.setData,
    setCanPrint: state.setCanPrint,
  }));

  const extracted = useIndication(medicament);

  useEffect(() => {
    setCanPrint(
      extracted.length > 1
        ? `Veuillez choisir une indication pour ${medicament.denomination}`
        : true,
    );
  }, [extracted.length, medicament.denomination, setCanPrint]);

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
