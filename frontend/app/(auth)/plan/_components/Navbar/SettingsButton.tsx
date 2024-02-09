import { useEffect } from "react";
import usePlanStore from "@/app/(auth)/plan/_lib/state";
import { PlanPrisePosologies } from "@/types/plan";
import { trpc } from "@/utils/api";
import { debounce } from "lodash";
import { SettingsIcon } from "lucide-react";
import { shallow } from "zustand/shallow";

import { PLAN_NEW } from "@plan-prise/api/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plan-prise/ui/dialog";
import { FormItem } from "@plan-prise/ui/form";
import { Label } from "@plan-prise/ui/label";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";
import { Switch } from "@plan-prise/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@plan-prise/ui/tooltip";
import { TypographyH4 } from "@plan-prise/ui/typography";

const posologies = Object.keys(
  PlanPrisePosologies,
) as (keyof typeof PlanPrisePosologies)[];

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
      { equalityFn: shallow },
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
                  {PlanPrisePosologies[posologie]}
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
