import FormLabel from "@/components/forms/FormLabel";
import Button from "@/components/forms/inputs/Button";
import CheckboxInput from "@/components/forms/inputs/CheckboxInput";
import Select from "@/components/forms/inputs/Select";
import TextInput from "@/components/forms/inputs/TextInput";
import type { MedicamentConservationDuree } from "@/types/medicament";
import type { PlanDataItem, PlanPrisePosologies } from "@/types/plan";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { Commentaire, Medicament, PrincipeActif } from "@prisma/client";

const posologies: PlanPrisePosologies[] = [
  "poso_matin",
  "poso_10h",
  "poso_midi",
  "poso_16h",
  "poso_18h",
  "poso_soir",
  "poso_coucher",
];

const PlanCardBody = ({
  data,
  medicament,
}: {
  data: PlanDataItem;
  medicament: Medicament & {
    commentaires: Commentaire[];
    conservationDureeParsed: MedicamentConservationDuree | null;
    indicationsParsed: string[];
    principesActifs: PrincipeActif[];
    voiesAdministrationParsed: string[];
  };
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4 pt-2">
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
      <div className="flex space-x-2">
        {posologies.map((posologie) => (
          <TextInput
            key={posologie}
            label={posologie}
            defaultValue={data?.posologies?.[posologie]}
          />
        ))}
      </div>
      <div>
        <FormLabel>Commentaires</FormLabel>
        <div className="space-y-2">
          {medicament.commentaires.map((commentaire) => (
            <div key={commentaire.id} className="flex items-center space-x-2">
              <span>{commentaire.population}</span>
              <CheckboxInput
                defaultChecked={data.commentaires?.[commentaire.id]?.checked}
              />
              <TextInput
                defaultValue={
                  data.commentaires?.[commentaire.id]?.texte ||
                  commentaire.texte
                }
              />
            </div>
          ))}
          {Object.entries(data?.custom_commentaires || {}).map(
            ([id, commentaire]) => (
              <div key={id} className="flex items-center">
                <XMarkIcon className="mx-2 h-4 w-4 text-teal-600 hover:text-teal-700" />
                <TextInput defaultValue={commentaire.texte} />
              </div>
            )
          )}
          <Button color="link" className="p-2">
            <PlusIcon className="mr-3 h-4 w-4" /> Ajouter un commentaire
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PlanCardBody;
