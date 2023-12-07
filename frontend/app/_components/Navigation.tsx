"use client";

import { useEffect } from "react";
import { useNavigationDispatch } from "@/app/_components/NavigationContextProvider";
import type { NavigationState } from "@/types/navigation";
import { NavigationActionKind } from "@/types/navigation";

const Navigation: React.FC<{
  loading?: NavigationState["loading"];
  returnTo?: NavigationState["returnTo"];
  title: NavigationState["title"];
}> = ({ loading, returnTo, title }) => {
  const dispatch = useNavigationDispatch();

  useEffect(() => {
    if (!dispatch) {
      throw new Error("Dispatch n'est pas disponible hors contexte");
    }

    dispatch({ type: NavigationActionKind.SET_LOADING, payload: loading });
    dispatch({ type: NavigationActionKind.SET_RETURNTO, payload: returnTo });
    dispatch({ type: NavigationActionKind.SET_TITLE, payload: title });
  });

  return null;
};

export default Navigation;
