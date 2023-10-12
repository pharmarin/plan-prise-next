import { parseData } from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import Button from "@/components/forms/inputs/Button";
import TextAreaInput from "@/components/forms/inputs/TextArea";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { createId } from "@paralleldrive/cuid2";
import type { Medicament } from "@prisma/client";

const PlanCommentaireCustomItem = ({
  commentId,
  medicId,
}: {
  commentId: string;
  medicId: string;
}) => {
  const data = usePlanStore(
    (state) =>
      parseData(state.data)?.[medicId].custom_commentaires?.[commentId],
  );
  const { setData, unsetData } = usePlanStore((state) => ({
    setData: state.setData,
    unsetData: state.unsetData,
  }));

  if (!data) {
    return undefined;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        color="link"
        className="p-0"
        onClick={() => {
          unsetData(`${medicId}.custom_commentaires.${commentId}`);
        }}
      >
        <XMarkIcon className="h-4 w-4 text-teal-600 hover:text-teal-700" />
      </Button>
      <TextAreaInput
        onChange={(event) =>
          setData(
            `${medicId}.custom_commentaires.${commentId}.texte`,
            event.currentTarget.value,
          )
        }
        value={data.texte}
      />
    </div>
  );
};

const PlanCommentaireCustom = ({ medicament }: { medicament: Medicament }) => {
  const data = usePlanStore(
    (state) => parseData(state.data)?.[medicament.id]?.custom_commentaires,
  );
  const setData = usePlanStore((state) => state.setData);

  return (
    <>
      {Object.keys(data || {}).map((id) => (
        <PlanCommentaireCustomItem
          key={`${medicament.id}_${id}`}
          commentId={id}
          medicId={medicament.id}
        />
      ))}
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
    </>
  );
};

export default PlanCommentaireCustom;
