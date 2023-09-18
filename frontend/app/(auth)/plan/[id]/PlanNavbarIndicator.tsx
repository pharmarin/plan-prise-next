import usePlanStore from "@/app/(auth)/plan/[id]/state";
import Spinner from "@/components/icons/Spinner";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const PlanNavbarIndicator = () => {
  const isSaving = usePlanStore((state) => state.isSaving);
  const isReady = usePlanStore((state) => state.id !== undefined);

  if (!isReady) {
    return undefined;
  }

  return (
    <div>
      {isSaving ? (
        <Spinner className="h-3 w-3 text-teal-900" />
      ) : (
        <CheckCircleIcon className="h-4 w-4 text-teal-600" />
      )}
    </div>
  );
};

export default PlanNavbarIndicator;
