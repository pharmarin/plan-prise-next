"use client";

import { useNavigationDispatch } from "@/components/NavigationContextProvider";
import { NavigationActionKind } from "@/types";
import { useEffect } from "react";

const ClientTitle: React.FC<{ title: string }> = ({ title }) => {
  const dispatch = useNavigationDispatch();

  useEffect(() => {
    if (!dispatch) {
      throw new Error("Dispatch n'est pas disponible hors contexte");
    }

    dispatch({ type: NavigationActionKind.SET_TITLE, payload: title });
  });

  return null;
};

export default ClientTitle;
