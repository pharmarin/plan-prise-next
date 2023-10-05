import usePlanStore from "@/app/(auth)/plan/[id]/state";
import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import Tooltip from "@/components/Tooltip";
import Spinner from "@/components/icons/Spinner";
import { trpc } from "@/trpc/client";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

const PlanDeleteButton = () => {
  const router = useRouter();
  const id = usePlanStore((state) => state.id);
  const { mutateAsync, isLoading } = trpc.plan.delete.useMutation();

  if (!id || id === PLAN_NEW) {
    return undefined;
  }

  return (
    <Tooltip message="Supprimer le plan de prise">
      <button
        className="cursor-pointer rounded-full bg-red-700 p-1 text-white"
        onClick={async () => {
          await mutateAsync(id);
          router.push("/plan");
        }}
      >
        {isLoading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        )}
      </button>
    </Tooltip>
  );
};

export default PlanDeleteButton;
