import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { createId } from "@paralleldrive/cuid2";
import type { Medicament } from "@prisma/client";
import { PlusIcon, XIcon } from "lucide-react";

import { Button } from "@plan-prise/ui/shadcn/ui/button";
import { Textarea } from "@plan-prise/ui/shadcn/ui/textarea";

const PlanCommentaireCustomItem = ({
  commentId,
  medicId,
}: {
  commentId: string;
  medicId: string;
}) => {
  const data = usePlanStore(
    (state) => state.data?.[medicId]?.custom_commentaires?.[commentId],
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
        className="p-0"
        onClick={() => {
          unsetData(`${medicId}.custom_commentaires.${commentId}`);
        }}
        variant="link"
      >
        <XIcon className="h-4 w-4 text-teal-600 hover:text-teal-700" />
      </Button>
      <Textarea
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
    (state) => state.data?.[medicament.id]?.custom_commentaires,
  );
  const setData = usePlanStore((state) => state.setData);

  return (
    <>
      {Object.keys(data ?? {}).map((id) => (
        <PlanCommentaireCustomItem
          key={`${medicament.id}_${id}`}
          commentId={id}
          medicId={medicament.id}
        />
      ))}
      <Button
        className="p-0"
        onClick={() =>
          setData(
            `${medicament.id}.custom_commentaires.${createId()}.texte`,
            "",
          )
        }
        variant="link"
      >
        <PlusIcon className="mr-3 h-4 w-4" /> Ajouter un commentaire
      </Button>
    </>
  );
};

export default PlanCommentaireCustom;
