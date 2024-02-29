"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/api";
import PrintPDF from "@/app/(auth)/plan/[planId]/pdf-document";
import usePlanStore from "@/app/(auth)/plan/state";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2, Printer } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plan-prise/ui/dialog";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@plan-prise/ui/tooltip";

const PrintButton = () => {
  const [open, setOpen] = useState(false);
  const canPrint = usePlanStore((state) => state.canPrint);
  const planId = usePlanStore((state) => state.id);
  const planData = usePlanStore((state) => state.data);
  const planSettings = usePlanStore((state) => state.settings);

  const { data: plan, isLoading } = trpc.plan.getById.useQuery(planId ?? "", {
    cacheTime: 1,
    enabled: open,
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
    <Dialog
      open={open}
      onOpenChange={(open) =>
        open
          ? canPrint === true
            ? setOpen(true)
            : document
                .getElementsByClassName("action-required")[0]
                ?.scrollIntoView()
          : setOpen(false)
      }
    >
      <DialogTrigger
        className={cn("rounded-full bg-green-700 p-1", {
          "cursor-not-allowed bg-gray-600": canPrint !== true,
        })}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Printer className="h-4 w-4 text-white" />
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Impression du plan de prise</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading && isLoadingPrecautions && (
            <div className="flex flex-row items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Étape 1/2</span>
            </div>
          )}
          {plan && precautions && (
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
              fileName={`Plan de prise n°${plan.displayId}`}
            >
              {({ error, loading, url }) => {
                if (loading) {
                  return (
                    <div className="flex flex-row items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Étape 2/2</span>
                    </div>
                  );
                }

                if (error) {
                  return (
                    <div>
                      Une erreur est survenue lors de la création du plan de
                      prise
                    </div>
                  );
                }

                if (url) {
                  return (
                    <div className="flex flex-row items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Télécharger le plan de prise</span>
                    </div>
                  );
                }
              }}
            </PDFDownloadLink>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintButton;
