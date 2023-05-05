import type { navbarIcons } from "@/components/navigation/NavbarLink";
import type { Route } from "next";

export enum NavigationActionKind {
  SET_TITLE = "SET_TITLE",
  SET_RETURNTO = "SET_RETURNTO",
}

type NavigationSetTitleAction = {
  type: NavigationActionKind.SET_TITLE;
  payload: NavigationState["title"];
};

type NavigationSetReturnToAction = {
  type: NavigationActionKind.SET_RETURNTO;
  payload?: NavigationState["returnTo"];
};

export type NavigationAction =
  | NavigationSetTitleAction
  | NavigationSetReturnToAction;

export type NavbarIcons = keyof typeof navbarIcons;

export type NavigationItem = {
  icon: NavbarIcons;
  className?: string;
} & ({ path: Route<string> | URL } | { event: string });

export type NavigationState = {
  options?: NavigationItem[];
  returnTo?: Route<string> | URL;
  title: string;
};
