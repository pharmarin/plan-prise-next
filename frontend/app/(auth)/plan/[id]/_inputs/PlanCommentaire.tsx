import usePlanStore, { parseData } from "@/app/(auth)/plan/[id]/state";
import { extractCommentaire } from "@/app/(auth)/plan/_lib/functions";
import CheckboxInput from "@/components/forms/inputs/CheckboxInput";
import TextInput from "@/components/forms/inputs/TextInput";
import type { Commentaire, Medicament } from "@prisma/client";
import { twMerge } from "tailwind-merge";

const PlanCommentaire = ({
  commentaire,
  medicament,
}: {
  commentaire: Commentaire;
  medicament: Medicament;
}) => {
  const data = usePlanStore(
    (state) =>
      parseData(state.data)?.[medicament.id]?.commentaires?.[commentaire.id],
  );
  const setData = usePlanStore((state) => state.setData);

  const comment = extractCommentaire(commentaire, data);

  return (
    <div className="flex items-center space-x-2">
      <CheckboxInput
        checked={comment.checked}
        onChange={(event) =>
          setData(
            `${medicament.id}.commentaires.${commentaire.id}.checked`,
            event.currentTarget.checked,
          )
        }
      />
      <TextInput
        className={twMerge(!comment.checked && "text-gray-400")}
        label={
          commentaire.population && (commentaire.population || "").length > 0
            ? commentaire.population
            : undefined
        }
        onChange={(event) =>
          setData(
            `${medicament.id}.commentaires.${commentaire.id}.texte`,
            event.currentTarget.value,
          )
        }
        slideLabel={(commentaire.population || "").length > 0}
        value={comment.texte}
      />
    </div>
  );
};

export default PlanCommentaire;
