import { NavbarIcons } from "lib/redux/navigation/slice";

// NAVIGATION

export enum NavigationActionKind {
  SET_TITLE = "SET_TITLE",
}

type NavigationSetTitleAction = {
  type: NavigationActionKind.SET_TITLE;
  payload: string;
};

export type NavigationAction = NavigationSetTitleAction;

export type NavigationItem = {
  icon: NavbarIcons;
  className?: string;
} & ({ path: string } | { event: string });

export type NavigationState = {
  options?: NavigationItem[];
  returnTo?: NavigationItem;
  title: string;
};
