"use client";

import { useEffect } from "react";
import { NavigationItem } from "@/types/navigation";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  loading?: boolean;
  options?: NavigationItem[];
  returnTo?: string | URL;
  title: string;
};

type Actions = { setNavigation: (state: State) => void };

export const useNavigationState = create(
  immer<State & Actions>((setState) => ({
    loading: undefined,
    options: undefined,
    returnTo: undefined,
    title: "",
    setNavigation: (state) => setState(state),
  })),
);

/* export const useNavigation = (state: State) => {
  const setNavigation = useNavigationState((state) => state.setNavigation);
  setNavigation(state);
}; */

export const Navigation = (state: State) => {
  const setNavigation = useNavigationState((state) => state.setNavigation);

  useEffect(() => setNavigation(state), [state]);

  return undefined;
};
