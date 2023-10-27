import type { navbarIcons } from "@/components/navigation/NavbarLink";
import type { Route } from "next";

export enum NavigationActionKind {
  SET_LOADING = "SET_LOADING",
  SET_RETURNTO = "SET_RETURNTO",
  SET_TITLE = "SET_TITLE",
}

type NavigationSetLoadingAction = {
  type: NavigationActionKind.SET_LOADING;
  payload: NavigationState["loading"];
};

type NavigationSetReturnToAction = {
  type: NavigationActionKind.SET_RETURNTO;
  payload?: NavigationState["returnTo"];
};

type NavigationSetTitleAction = {
  type: NavigationActionKind.SET_TITLE;
  payload: NavigationState["title"];
};

export type NavigationAction =
  | NavigationSetLoadingAction
  | NavigationSetReturnToAction
  | NavigationSetTitleAction;

export type NavbarIcons = keyof typeof navbarIcons;

export type NavigationItem = {
  icon: NavbarIcons;
  className?: string;
} & ({ path: Route<string> | URL } | { event: string });

export type NavigationState = {
  loading?: boolean;
  options?: NavigationItem[];
  returnTo?: Route<string> | URL;
  title: string;
};
