import usePlanStore, {
  parseConservationDuree,
  parseData,
  parseIndications,
} from "@/app/(auth)/plan/[id]/state";
import FormLabel from "@/components/forms/FormLabel";
import Button from "@/components/forms/inputs/Button";
import CheckboxInput from "@/components/forms/inputs/CheckboxInput";
import Select from "@/components/forms/inputs/Select";
import TextInput from "@/components/forms/inputs/TextInput";
import { PlanPrisePosologies } from "@/types/plan";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { Commentaire, Medicament, PrincipeActif } from "@prisma/client";
import { shallow } from "zustand/shallow";

const PlanCardBody = ({
  medicament,
}: {
  medicament: Medicament & {
    commentaires: Commentaire[];
    principesActifs: PrincipeActif[];
  };
}) => {
  const data = usePlanStore(
    (state) => parseData(state.data)[medicament.id] || {},
    shallow
  );

  const posologies = Object.keys(
    PlanPrisePosologies
  ) as (keyof typeof PlanPrisePosologies)[];

  const indicationsParsed = parseIndications(medicament.indications);
  const conservationDureeParsed = parseConservationDuree(
    medicament.conservationDuree
  );

  return (
    <div className="flex flex-col space-y-2 p-4 pt-2">
      <div className="flex flex-row">
        <div className="w-full">
          <FormLabel>Indication</FormLabel>
          {(data.indication || "").length > 0 ||
          indicationsParsed.length === 1 ? (
            <TextInput defaultValue={data.indication || indicationsParsed[0]} />
          ) : (
            <Select>
              {indicationsParsed.map((indication) => (
                <option key={indication} value={indication}>
                  {indication}
                </option>
              ))}
            </Select>
          )}
        </div>
        {conservationDureeParsed &&
          (conservationDureeParsed.length === 1 ? (
            <span>{conservationDureeParsed[0].duree}</span>
          ) : (
            <Select>
              {conservationDureeParsed.map((conservationDuree, index) => (
                <option key={index} value={conservationDuree.laboratoire}>
                  {conservationDuree.laboratoire}
                </option>
              ))}
            </Select>
          ))}
      </div>
      <div className="flex space-x-2">
        {posologies.map((posologie) => (
          <TextInput
            key={posologie}
            label={PlanPrisePosologies[posologie]}
            defaultValue={data.posologies?.[posologie]}
          />
        ))}
      </div>
      <div>
        <FormLabel>Commentaires</FormLabel>
        <div className="space-y-2">
          {medicament.commentaires.map((commentaire) => (
            <div key={commentaire.id} className="flex items-center space-x-2">
              <CheckboxInput
                defaultChecked={data.commentaires?.[commentaire.id]?.checked}
              />
              <TextInput
                defaultValue={
                  data.commentaires?.[commentaire.id]?.texte ||
                  commentaire.texte
                }
              />
              {commentaire.population && <span>{commentaire.population}</span>}
            </div>
          ))}
          {Object.entries(data.custom_commentaires || {}).map(
            ([id, commentaire]) => (
              <div key={id} className="flex items-center space-x-2">
                <Button color="link" className="p-0">
                  <XMarkIcon className="h-4 w-4 text-teal-600 hover:text-teal-700" />
                </Button>
                <TextInput defaultValue={commentaire.texte} />
              </div>
            )
          )}
          <Button color="link" className="p-0">
            <PlusIcon className="mr-3 h-4 w-4" /> Ajouter un commentaire
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PlanCardBody;
