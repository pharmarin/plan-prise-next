"use client";

import { useNavigationDispatch } from "@/components/NavigationContextProvider";
import { NavigationActionKind } from "@/types";

const ClientTitle: React.FC<{ title: string }> = ({ title }) => {
  const dispatch = useNavigationDispatch();

  if (!dispatch) {
    throw new Error("Dispatch n'est pas disponible hors contexte");
  }

  dispatch({ type: NavigationActionKind.SET_TITLE, payload: title });

  return null;
};

export default ClientTitle;
