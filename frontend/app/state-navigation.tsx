"use client";

import { useEffect } from "react";
import {
  ArrowLeftIcon,
  HomeIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const navbarIcons = {
  arrowLeft: ArrowLeftIcon,
  delete: Trash2Icon,
  edit: PencilIcon,
  loading: Loader2Icon,
  home: HomeIcon,
  plus: PlusIcon,
  save: SaveIcon,
};

export type NavigationItem = {
  icon: keyof typeof navbarIcons;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
} & ({ path: string } | { event: string });

type State = {
  loading?: boolean;
  options?: NavigationItem[];
  returnTo?: string;
  title: string;
};

type Actions = {
  setNavigation: (state: State) => void;
  setOptions: (options: State["options"]) => void;
};

const initialState: State = {
  loading: undefined,
  options: undefined,
  returnTo: undefined,
  title: "",
};

export const useNavigationState = create(
  immer<State & Actions>((setState) => ({
    ...initialState,
    setNavigation: (navigation) => setState({ ...initialState, ...navigation }),
    setOptions: (options) =>
      setState((state) => {
        state.options = options;
      }),
  })),
);

export const Navigation = (state: State) => {
  const setNavigation = useNavigationState((state) => state.setNavigation);

  useEffect(() => setNavigation(state), [setNavigation, state]);

  return undefined;
};
