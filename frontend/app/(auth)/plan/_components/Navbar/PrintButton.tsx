"use client";

import usePlanStore from "@/app/(auth)/plan/_lib/state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PrintButton = () => {
  const canPrint = usePlanStore((state) => state.canPrint);
  const planId = usePlanStore((state) => state.id);

  const { id } = useParams<{ id: string }>();

  if (!planId) {
    return undefined;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "cursor-pointer rounded-full bg-red-700 p-1 text-white",
            {
              "cursor-not-allowed bg-gray-600": canPrint !== true,
              "bg-green-700": canPrint === true,
            },
          )}
          asChild
        >
          {canPrint ? (
            <Link href={`/plan/${id}/print`} target="_blank">
              <Printer className="h-4 w-4" />
            </Link>
          ) : (
            <Printer className="h-4 w-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {canPrint === true && <p>Imprimer le plan de prise</p>}
          {typeof canPrint === "string" && <p>{canPrint}</p>}
          {canPrint === false && (
            <p>Vous ne pouvez pas imprimer actuellement</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PrintButton;
