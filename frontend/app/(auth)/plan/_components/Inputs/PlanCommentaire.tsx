import { extractCommentaire } from "@/app/(auth)/plan/functions";
import usePlanStore from "@/app/(auth)/plan/state";
import type { Commentaire, Medicament } from "@prisma/client";
import { twMerge } from "tailwind-merge";

import { Checkbox } from "@plan-prise/ui/checkbox";
import { Label } from "@plan-prise/ui/label";
import { Textarea } from "@plan-prise/ui/textarea";

const PlanCommentaire = ({
  commentaire,
  medicament,
}: {
  commentaire: Commentaire;
  medicament: Medicament;
}) => {
  const data = usePlanStore(
    (state) => state.data?.[medicament.id]?.commentaires?.[commentaire.id],
  );
  const setData = usePlanStore((state) => state.setData);

  const comment = extractCommentaire(commentaire, data);

  return (
    <div
      className="flex items-center space-x-2"
      data-testid="plan-card-commentaire-group"
    >
      <Checkbox
        checked={comment.checked}
        onCheckedChange={(checked) =>
          setData(
            `${medicament.id}.commentaires.${commentaire.id}.checked`,
            checked,
          )
        }
      />
      <div className="flex w-full flex-col">
        {commentaire.population &&
          (commentaire.population || "").length > 0 && (
            <Label className="z-10 -mb-3 ml-1 w-fit bg-white p-2">
              {commentaire.population}
            </Label>
          )}
        <Textarea
          className={twMerge(!comment.checked && "text-gray-400")}
          onChange={(event) =>
            setData(
              `${medicament.id}.commentaires.${commentaire.id}.texte`,
              event.currentTarget.value,
            )
          }
          value={comment.texte}
        />
      </div>
    </div>
  );
};

export default PlanCommentaire;
