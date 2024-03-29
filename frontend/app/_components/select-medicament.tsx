"use client";

import { findManyMedicsAction } from "@/app/_components/actions";
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
      onSearchChange={async (value) =>
        value.length > 2
          ? (await debouncedFindManyMedicsAction({ query: value }))?.data ?? []
          : []
      }
      placeholder="Ajouter un médicament"
    />
  );
};

export default MedicamentSelect;
