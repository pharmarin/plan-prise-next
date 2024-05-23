import { useCallback } from "react";
import { saveSettingsAction } from "@/app/(auth)/plan/actions";
import usePlanStore from "@/app/(auth)/plan/state";
import { PlanPrisePosologies } from "@/types/plan";
import { debounce } from "lodash-es";

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
  const { settings, setSetting, setIsSaving } = usePlanStore((state) => ({
    setSetting: state.setSetting,
    setIsSaving: state.setIsSaving,
    settings: state.settings,
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveSettingsDebounced = useCallback(
    debounce(async (settings) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await saveSettingsAction(settings);
      setIsSaving(false);
    }, 2000),
    [],
  );

  if (!settings) {
    return undefined;
  }

  return (
    <Dialog open={show} onOpenChange={() => setShow()}>
      <DialogContent data-testid="plan-settings-dialog">
        <DialogHeader>
          <DialogTitle>Réglages</DialogTitle>
          <TypographyH4>Colonnes à afficher</TypographyH4>
          <form
            className="grid grid-cols-2 gap-x-24 gap-y-4"
            onChange={async () => {
              setIsSaving(true);
              saveSettingsDebounced.cancel();
              await saveSettingsDebounced({
                planId: usePlanStore.getState().id,
                settings: usePlanStore.getState().settings,
              });
            }}
          >
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
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSettings;
