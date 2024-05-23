"use client";

import { findManyMedicsAction } from "@/app/actions";
import debounce from "debounce-promise";

import MultiSelect from "@plan-prise/ui/components/multi-select";

const MedicamentSelect = ({
  onChange,
}: {
  onChange: (value: { denomination: string; id: string }) => void;
}) => {
  const debouncedFindManyMedicsAction = debounce(findManyMedicsAction, 500);

  return (
    <MultiSelect
      keys={{
        label: "denomination",
        value: "id",
      }}
      onChange={onChange}
      onSearchChange={async (value) => {
        if (value.length > 2) {
          const results = (
            await debouncedFindManyMedicsAction({ query: value })
          )?.data;

          if (results && results.length > 0) {
            return results;
          } else {
            return [
              {
                denomination: `Ajouter "${value.toLocaleUpperCase()}"`,
                id: value.toLocaleUpperCase(),
              },
            ];
          }
        } else {
          return [] as { denomination: string; id: string }[];
        }
      }}
      placeholder="Ajouter un médicament"
    />
  );
};

export default MedicamentSelect;
