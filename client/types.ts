import { navbarIcons } from "@/components/navigation/NavbarLink";

export enum NavigationActionKind {
  SET_TITLE = "SET_TITLE",
}

type NavigationSetTitleAction = {
  type: NavigationActionKind.SET_TITLE;
  payload: string;
};

export type NavigationAction = NavigationSetTitleAction;

export type NavbarIcons = keyof typeof navbarIcons;

export type NavigationItem = {
  icon: NavbarIcons;
  className?: string;
} & (
  | { path: __next_route_internal_types__.RouteImpl<string> }
  | { event: string }
);

export type NavigationState = {
  options?: NavigationItem[];
  returnTo?: NavigationItem;
  title: string;
};
