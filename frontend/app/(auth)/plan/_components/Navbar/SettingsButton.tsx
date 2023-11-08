import { useEffect } from "react";
import { PLAN_NEW } from "@/app/(auth)/plan/_lib/constants";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TypographyH4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { debounce } from "lodash";
import { SettingsIcon } from "lucide-react";

const posologies = Object.keys(
  PP.Plan.PlanPrisePosologies,
) as (keyof typeof PP.Plan.PlanPrisePosologies)[];

const SettingsButton = () => {
  const planId = usePlanStore((state) => state.id);
  const { settings, setSetting } = usePlanStore((state) => ({
    setSetting: state.setSetting,
    settings: state.settings,
  }));

  const { mutateAsync: saveSettings } = trpc.plan.saveSettings.useMutation();
  const saveSettingsDebounced = debounce(async (settings) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await saveSettings(settings);
  }, 2000);

  useEffect(() => {
    const unsubscribe = usePlanStore.subscribe(
      (state) => ({ id: state.id, settings: state.settings }),
      async (newState, previousState) => {
        if (
          previousState.id !== PLAN_NEW &&
          newState.id !== PLAN_NEW &&
          newState.settings !== null
        ) {
          await saveSettingsDebounced({
            planId: newState.id,
            settings: newState.settings,
          });
        }
      },
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!settings) {
    return undefined;
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn("rounded-full bg-orange-400 p-1", {
          "cursor-not-allowed bg-gray-600": planId === PLAN_NEW,
        })}
        disabled={planId === PLAN_NEW}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SettingsIcon className="h-4 w-4 text-white" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Réglages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Réglages</DialogTitle>
          <TypographyH4>Colonnes à afficher</TypographyH4>
          <div className="grid grid-cols-2 gap-x-24 gap-y-4">
            {posologies.map((posologie) => (
              <FormItem
                key={posologie}
                className="flex items-center justify-between"
              >
                <Label htmlFor={posologie}>
                  {PP.Plan.PlanPrisePosologies[posologie]}
                </Label>
                <Switch
                  checked={settings.posos?.[posologie]}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  id={posologie}
                  onCheckedChange={(value) =>
                    setSetting(`posos.${posologie}`, value)
                  }
                />
              </FormItem>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsButton;
