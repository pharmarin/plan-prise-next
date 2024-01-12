import PlanCommentaire from "@/app/(auth)/plan/_components/Inputs/PlanCommentaire";
import PlanCommentaireCustom from "@/app/(auth)/plan/_components/Inputs/PlanCommentaireCustom";
import PlanConservation from "@/app/(auth)/plan/_components/Inputs/PlanConservation";
import PlanIndication from "@/app/(auth)/plan/_components/Inputs/PlanIndication";
import PlanPosologie from "@/app/(auth)/plan/_components/Inputs/PlanPosologie";
import { extractPosologiesSettings } from "@/app/(auth)/plan/_lib/functions";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { ThermometerSnowflake } from "lucide-react";

import { Label } from "@plan-prise/ui/shadcn/ui/label";

const PlanCardBody = ({
  medicament,
}: {
  medicament: PP.Medicament.Include;
}) => {
  const settings = usePlanStore((state) => state.settings?.posos);

  const posologies = extractPosologiesSettings(settings);

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
          <Label className="space-x-2">
            <ThermometerSnowflake className="inline h-4 w-4 text-gray-900" />
            <span>Se conserver au frigo avant ouverture</span>
          </Label>
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
        <Label>Commentaires</Label>
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
