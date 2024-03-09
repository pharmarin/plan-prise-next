import { useEffect } from "react";
import { saveSettingsAction } from "@/app/(auth)/plan/[planId]/actions";
import usePlanStore from "@/app/(auth)/plan/state";
import { PlanPrisePosologies } from "@/types/plan";
import { debounce } from "lodash-es";
import { shallow } from "zustand/shallow";

import { PLAN_NEW } from "@plan-prise/api/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@plan-prise/ui/dialog";
import { FormItem } from "@plan-prise/ui/form";
import { Label } from "@plan-prise/ui/label";
import { Switch } from "@plan-prise/ui/switch";
import { TypographyH4 } from "@plan-prise/ui/typography";

const posologies = Object.keys(
  PlanPrisePosologies,
) as (keyof typeof PlanPrisePosologies)[];

const PlanSettings = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: () => void;
}) => {
  const { settings, setSetting } = usePlanStore((state) => ({
    setSetting: state.setSetting,
    settings: state.settings,
  }));

  const saveSettingsDebounced = debounce(async (settings) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await saveSettingsAction(settings);
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
    <Dialog open={show} onOpenChange={() => setShow()}>
      <DialogContent data-testid="plan-settings-dialog">
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

export default PlanSettings;
