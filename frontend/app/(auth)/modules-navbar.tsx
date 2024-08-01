"use client";

import { useEffect } from "react";
import type { deleteCalendarAction } from "@/app/(auth)/calendrier/actions";
import type { deletePlanAction } from "@/app/(auth)/plan/actions";
import { routes } from "@/app/routes-schema";
import { useNavigationState } from "@/app/state-navigation";
import { useEventListener } from "@/utils/event-listener";
import { useAction } from "next-safe-action/hooks";

import { NEW } from "@plan-prise/api/constants";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

enum EVENTS {
  DELETE = "DELETE",
  PRINT = "PRINT",
  SETTINGS = "SETTINGS",
}

const ModulesNavbar = ({
  canPrint,
  displayId,
  id,
  isSaving,
  medicsLength,
  onDeleteAction,
  type,
  ...props
}: {
  canPrint: string | boolean;
  displayId: number;
  id: string;
  isSaving: boolean;
  medicsLength: number;
} & (
  | {
      type: "plan";
      onDeleteAction: typeof deletePlanAction;
      setShowSettings: (value: boolean) => void;
    }
  | { type: "calendar"; onDeleteAction: typeof deleteCalendarAction }
)) => {
  const setShowSettings =
    "setShowSettings" in props ? props.setShowSettings : undefined;

  const { setOptions, setTitle } = useNavigationState((state) => ({
    setOptions: state.setOptions,
    setTitle: state.setTitle,
  }));

  const { executeAsync: deleteAction, isExecuting: isDeleting } = useAction(
    onDeleteAction as typeof type extends "plan"
      ? typeof deletePlanAction
      : typeof deleteCalendarAction,
  );

  useEventListener(EVENTS.DELETE, async () =>
    type === "plan"
      ? (deleteAction as unknown as typeof deletePlanAction)({ planId: id })
      : deleteAction({
          calendarId: id,
        }),
  );

  useEventListener(
    EVENTS.SETTINGS,
    () => setShowSettings && setShowSettings(true),
  );

  useEventListener(EVENTS.PRINT, () => {
    if (isSaving) return;
    if (canPrint === true) {
      window.open(
        type === "plan"
          ? routes.planPrint({ planId: displayId })
          : routes.calendarPrint({ calendarId: displayId }),
      );
    } else {
      document.getElementsByClassName("action-required")[0]?.scrollIntoView();
    }
  });

  useEffect(() => {
    setTitle(
      displayId > 0
        ? `${type === "plan" ? "Plan de prise" : "Calendrier"} n°${displayId}`
        : `Nouveau ${type === "plan" ? "plan de prise" : "calendrier"}`,
    );
  }, [displayId, setTitle, type]);

  useEffect(() => {
    setOptions(
      medicsLength > 0
        ? [
            {
              icon: isSaving ? "loading" : "checkCircle",
              className: cn(
                "plan-loading-state",
                isSaving
                  ? "animate-spin text-teal-900 plan-is-saving"
                  : "text-teal-600 plan-saved",
              ),
              path: "",
              tooltip: isSaving
                ? "⏳ Sauvegarde en cours"
                : `✅ ${type === "plan" ? "Plan de prise" : "Calendrier"} sauvegardé`,
            },
            {
              icon: isDeleting ? "loading" : "trash",
              className: "rounded-full bg-red-700 p-1 text-white",
              event: EVENTS.DELETE,
              tooltip: "Supprimer le plan de prise",
            },
            ...(setShowSettings
              ? [
                  {
                    icon: "settings",
                    className: cn(
                      "rounded-full bg-orange-400 p-1 text-white plan-settings-button",
                      {
                        "cursor-not-allowed bg-gray-600": id === NEW,
                      },
                    ),
                    disabled: id === NEW,
                    event: EVENTS.SETTINGS,
                  } as const,
                ]
              : []),
            {
              icon: "printer",
              className: cn("rounded-full bg-green-700 p-1 text-white", {
                "cursor-not-allowed bg-gray-600": canPrint !== true || isSaving,
              }),
              event: EVENTS.PRINT,
              tooltip:
                !isSaving && canPrint === true
                  ? "Imprimer le plan de prise"
                  : !isSaving && typeof canPrint === "string"
                    ? canPrint
                    : "Vous ne pouvez pas imprimer actuellement",
            },
          ]
        : [],
    );
  }, [
    canPrint,
    id,
    isDeleting,
    isSaving,
    medicsLength,
    setOptions,
    setShowSettings,
    type,
  ]);

  return null;
};

export default ModulesNavbar;
