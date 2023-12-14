import { useRouter } from "next/navigation";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { trpc } from "@/utils/api";
import { Loader2, Trash2 } from "lucide-react";

import { PLAN_NEW } from "@plan-prise/api/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@plan-prise/ui/shadcn/ui/tooltip";

const DeleteButton = () => {
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
            <Loader2 className="h-4 w-4" />
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

export default DeleteButton;
