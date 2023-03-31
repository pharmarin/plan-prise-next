"use client";

import { useNavigationDispatch } from "@/components/NavigationContextProvider";
import { NavigationActionKind, type NavigationState } from "@/types";
import { useEffect } from "react";

const Navigation: React.FC<{
  returnTo?: NavigationState["returnTo"];
  title: NavigationState["title"];
}> = ({ returnTo, title }) => {
  const dispatch = useNavigationDispatch();

  useEffect(() => {
    if (!dispatch) {
      throw new Error("Dispatch n'est pas disponible hors contexte");
    }

    dispatch({ type: NavigationActionKind.SET_TITLE, payload: title });
    dispatch({ type: NavigationActionKind.SET_RETURNTO, payload: returnTo });
  });

  return null;
};

export default Navigation;
