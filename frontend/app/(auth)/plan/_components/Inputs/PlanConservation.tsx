import {
  extractConservation,
  parseData,
} from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import FormLabel from "@/components/forms/FormLabel";
import Button from "@/components/forms/inputs/Button";
import Select from "@/components/forms/inputs/Select";
import type { Medicament } from "@prisma/client";
import type { ChangeEvent } from "react";

const NOT_SET = "NOT_SET";

const PlanConservation = ({ medicament }: { medicament: Medicament }) => {
  const data = usePlanStore(
    (state) => parseData(state.data)?.[medicament.id]?.conservation,
  );
  const { setData, unsetData } = usePlanStore((state) => ({
    setData: state.setData,
    unsetData: state.unsetData,
  }));

  const conservationDuree = extractConservation(medicament, data);

  if (conservationDuree.values.length === 0) {
    return undefined;
  }

  return (
    <>
      <FormLabel>Durée de conservation après ouverture</FormLabel>
      {conservationDuree.values.length === 1 ? (
        <div>
          <p className="text-sm text-gray-900">
            {conservationDuree.values[0].duree}
          </p>
          {conservationDuree.custom && (
            <div className="flex space-x-2">
              <span className="text-sm italic text-gray-900">
                Pour {conservationDuree.values[0].laboratoire}
              </span>
              <Button
                className="p-0"
                color="link"
                onClick={() => unsetData(`${medicament.id}.conservation`)}
              >
                Changer de laboratoire
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Select
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setData(`${medicament.id}.conservation`, event.currentTarget.value)
          }
          value={NOT_SET}
        >
          <option value={NOT_SET}>Choisissez un laboratoire</option>
          {conservationDuree.values.map((conservationDuree, index) => (
            <option key={index} value={conservationDuree.laboratoire}>
              {conservationDuree.laboratoire}
            </option>
          ))}
        </Select>
      )}
    </>
  );
};

export default PlanConservation;
