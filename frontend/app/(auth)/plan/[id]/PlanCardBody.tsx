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
import { createId } from "@paralleldrive/cuid2";
import type { Commentaire, Medicament, PrincipeActif } from "@prisma/client";
import type { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

const PlanCardBody = ({
  medicament,
}: {
  medicament: Medicament & {
    commentaires: Commentaire[];
    principesActifs: PrincipeActif[];
  };
}) => {
  const data = usePlanStore(
    (state) => parseData(state.data)?.[medicament.id] || {},
  );
  const setData = usePlanStore((state) => state.setData);
  const unsetData = usePlanStore((state) => state.unsetData);

  const posologies = Object.keys(
    PlanPrisePosologies,
  ) as (keyof typeof PlanPrisePosologies)[];

  const indicationsParsed = parseIndications(medicament.indications);
  const conservationDureeParsed = parseConservationDuree(
    medicament.conservationDuree,
  );

  return (
    <div className="flex flex-col space-y-2 p-4 pt-2">
      <div className="flex flex-row">
        <div className="w-full">
          <FormLabel>Indication</FormLabel>
          {(data.indication || "").length > 0 ||
          indicationsParsed.length === 1 ? (
            <TextInput
              onChange={(event) =>
                setData(
                  `${medicament.id}.indication`,
                  event.currentTarget.value,
                )
              }
              value={data.indication || indicationsParsed[0]}
            />
          ) : (
            <Select
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setData(
                  `${medicament.id}.indication`,
                  event.currentTarget.value,
                )
              }
              value={indicationsParsed[0]}
            >
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
            onChange={(event) =>
              setData(
                `${medicament.id}.posologies.${posologie}`,
                event.currentTarget.value,
              )
            }
            value={data.posologies?.[posologie] || ""}
          />
        ))}
      </div>
      <div>
        <FormLabel>Commentaires</FormLabel>
        <div className="space-y-2">
          {medicament.commentaires.map((commentaire) => (
            <div key={commentaire.id} className="flex items-center space-x-2">
              <CheckboxInput
                checked={data.commentaires?.[commentaire.id]?.checked}
                onChange={(event) =>
                  setData(
                    `${medicament.id}.commentaires.${commentaire.id}.checked`,
                    event.currentTarget.checked,
                  )
                }
              />
              <TextInput
                className={twMerge(
                  !data.commentaires?.[commentaire.id]?.checked &&
                    "text-gray-400",
                )}
                onChange={(event) =>
                  setData(
                    `${medicament.id}.commentaires.${commentaire.id}.texte`,
                    event.currentTarget.value,
                  )
                }
                value={
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
                <Button
                  color="link"
                  className="p-0"
                  onClick={() => {
                    unsetData(`${medicament.id}.custom_commentaires.${id}`);
                  }}
                >
                  <XMarkIcon className="h-4 w-4 text-teal-600 hover:text-teal-700" />
                </Button>
                <TextInput
                  onChange={(event) =>
                    setData(
                      `${medicament.id}.custom_commentaires.${id}.texte`,
                      event.currentTarget.value,
                    )
                  }
                  value={commentaire.texte}
                />
              </div>
            ),
          )}
          <Button
            color="link"
            className="p-0"
            onClick={() =>
              setData(
                `${medicament.id}.custom_commentaires.${createId()}.texte`,
                "",
              )
            }
          >
            <PlusIcon className="mr-3 h-4 w-4" /> Ajouter un commentaire
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PlanCardBody;
