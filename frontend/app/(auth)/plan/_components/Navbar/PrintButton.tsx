"use client";

import PrintPDF from "@/app/(auth)/plan/[id]/PrintPDF";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Loader2, Printer } from "lucide-react";
import { useState } from "react";

import { useSession } from "next-auth/react";

const PrintButton = () => {
  const [isPrinting, setIsPrinting] = useState(false);
  const canPrint = usePlanStore((state) => state.canPrint);
  const planId = usePlanStore((state) => state.id);
  const planData = usePlanStore((state) => state.data);
  const planSettings = usePlanStore((state) => state.settings);

  const { data: plan, isLoading } = trpc.plan.getById.useQuery(planId ?? "", {
    cacheTime: 1,
    enabled: isPrinting,
  });
  const { data: precautions, isLoading: isLoadingPrecautions } =
    trpc.medics.findPrecautionsByMedicId.useQuery(
      plan?.medicsOrder as string[],
    );
  const { data: session } = useSession();

  if (!planId || !planData || !planSettings || !session?.user) {
    return undefined;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "cursor-pointer rounded-full bg-red-700 p-1 text-white",
            {
              "cursor-not-allowed bg-gray-600":
                canPrint !== true || isPrinting === true,
              "bg-green-700": canPrint === true && isPrinting === false,
            },
          )}
          onClick={() =>
            canPrint === true
              ? setIsPrinting(true)
              : document
                  .getElementsByClassName("action-required")[0]
                  ?.scrollIntoView()
          }
        >
          {(() => {
            const loader = <Loader2 className="h-4 w-4 animate-spin" />;

            if (isPrinting && (isLoading || isLoadingPrecautions)) {
              return loader;
            }

            if (isPrinting && plan && precautions) {
              return (
                <PDFDownloadLink
                  document={
                    <PrintPDF
                      plan={plan}
                      planData={planData}
                      planSettings={planSettings}
                      precautions={precautions}
                      user={session.user}
                    />
                  }
                >
                  {({ loading, url }) => {
                    if (loading) {
                      return loader;
                    }

                    if (url) {
                      window.open(url, "plan_print");
                      setTimeout(() => setIsPrinting(false), 500);
                    }
                  }}
                </PDFDownloadLink>
              );
            }

            return <Printer className="h-4 w-4" />;
          })()}
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
