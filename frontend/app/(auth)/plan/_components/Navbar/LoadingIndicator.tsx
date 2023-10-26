import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Loader2 } from "lucide-react";

const PlanNavbarIndicator = () => {
  const isSaving = usePlanStore((state) => state.isSaving);
  const isReady = usePlanStore(
    (state) => state.id !== undefined && state.id !== PLAN_NEW,
  );

  if (!isReady) {
    return undefined;
  }

  return (
    <TooltipProvider>
      {isSaving ? (
        <Tooltip>
          <TooltipTrigger>
            <Loader2 className="h-4 w-4 text-teal-900" />
          </TooltipTrigger>
          <TooltipContent>
            <p>⏳ Sauvegarde en cours</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger>
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p>✅ Plan de prise sauvegardé</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
};

export default PlanNavbarIndicator;