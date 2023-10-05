import usePlanStore from "@/app/(auth)/plan/[id]/state";
import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import Tooltip from "@/components/Tooltip";
import Spinner from "@/components/icons/Spinner";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const PlanNavbarIndicator = () => {
  const isSaving = usePlanStore((state) => state.isSaving);
  const isReady = usePlanStore(
    (state) => state.id !== undefined && state.id !== PLAN_NEW,
  );

  if (!isReady) {
    return undefined;
  }

  return (
    <div>
      {isSaving ? (
        <Tooltip message="⏳ Sauvegarde en cours">
          <Spinner className="h-3 w-3 text-teal-900" />
        </Tooltip>
      ) : (
        <Tooltip message="✅ Plan de prise sauvegardé">
          <CheckCircleIcon className="h-4 w-4 text-teal-600" />
        </Tooltip>
      )}
    </div>
  );
};

export default PlanNavbarIndicator;
