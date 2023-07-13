import FormLabel from "@/components/forms/FormLabel";
import Select from "@/components/forms/inputs/Select";
import TextInput from "@/components/forms/inputs/TextInput";
import type { MedicamentConservationDuree } from "@/types/medicament";
import type { PlanDataItem } from "@/types/plan";
import type { Medicament, PrincipeActif } from "@prisma/client";

const PlanCardBody = ({
  data,
  medicament,
}: {
  data: PlanDataItem;
  medicament: Medicament & {
    conservationDureeParsed: MedicamentConservationDuree | null;
    indicationsParsed: string[];
    principesActifs: PrincipeActif[];
    voiesAdministrationParsed: string[];
  };
}) => {
  return (
    <div className="flex p-4 pt-2">
      <div className="flex flex-row">
        <div>
          <FormLabel>Indication</FormLabel>
          {(data?.indication || "").length > 0 ||
          medicament.indicationsParsed.length === 1 ? (
            <TextInput
              defaultValue={data.indication || medicament.indicationsParsed[0]}
            />
          ) : (
            <Select label="Indication">
              {medicament.indicationsParsed.map((indication) => (
                <option key={indication} value={indication}>
                  {indication}
                </option>
              ))}
            </Select>
          )}
        </div>
        {medicament.conservationDureeParsed &&
          (medicament.conservationDureeParsed.length === 1 ? (
            <span>{medicament.conservationDureeParsed[0].duree}</span>
          ) : (
            <Select>
              {medicament.conservationDureeParsed.map(
                (conservationDuree, index) => (
                  <option key={index} value={conservationDuree.laboratoire}>
                    {conservationDuree.laboratoire}
                  </option>
                )
              )}
            </Select>
          ))}
      </div>
    </div>
  );
};
export default PlanCardBody;
