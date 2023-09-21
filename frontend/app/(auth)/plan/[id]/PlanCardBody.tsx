import PlanCommentaire from "@/app/(auth)/plan/[id]/_inputs/PlanCommentaire";
import PlanCommentaireCustom from "@/app/(auth)/plan/[id]/_inputs/PlanCommentaireCustom";
import PlanConservation from "@/app/(auth)/plan/[id]/_inputs/PlanConservation";
import PlanIndication from "@/app/(auth)/plan/[id]/_inputs/PlanIndication";
import PlanPosologie from "@/app/(auth)/plan/[id]/_inputs/PlanPosologie";
import FormLabel from "@/components/forms/FormLabel";
import { PlanPrisePosologies } from "@/types/plan";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import type { Commentaire, Medicament, PrincipeActif } from "@prisma/client";

const PlanCardBody = ({
  medicament,
}: {
  medicament: Medicament & {
    commentaires: Commentaire[];
    principesActifs: PrincipeActif[];
  };
}) => {
  const posologies = Object.keys(
    PlanPrisePosologies,
  ) as (keyof typeof PlanPrisePosologies)[];

  return (
    <div className="flex flex-col space-y-2 p-4 pt-2">
      <div className="flex flex-row space-x-4">
        <div className="w-1/2">
          <PlanIndication medicament={medicament} />
        </div>
        <div>
          <PlanConservation medicament={medicament} />
        </div>
        {medicament.conservationFrigo && (
          <div className="space-x-2">
            <FormLabel>Frigo</FormLabel>
            <CheckCircleIcon className="inline h-4 w-4 text-gray-900" />
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        {posologies.map((posologie) => (
          <PlanPosologie
            key={`${medicament.id}.${posologie}`}
            medicament={medicament}
            name={posologie}
          />
        ))}
      </div>
      <div>
        <FormLabel>Commentaires</FormLabel>
        <div className="space-y-2">
          {medicament.commentaires.map((commentaire) => (
            <PlanCommentaire
              key={`${medicament.id}_${commentaire.id}`}
              commentaire={commentaire}
              medicament={medicament}
            />
          ))}
          <PlanCommentaireCustom medicament={medicament} />
        </div>
      </div>
    </div>
  );
};
export default PlanCardBody;
