import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import Spinner from "@/components/icons/Spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/trpc/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const PlanDeleteButton = () => {
  const router = useRouter();
  const id = usePlanStore((state) => state.id);
  const { mutateAsync, isLoading } = trpc.plan.delete.useMutation();

  if (!id || id === PLAN_NEW) {
    return undefined;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="cursor-pointer rounded-full bg-red-700 p-1 text-white"
          onClick={async () => {
            await mutateAsync(id);
            router.push("/plan");
          }}
        >
          {isLoading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Supprimer le plan de prise</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlanDeleteButton;
