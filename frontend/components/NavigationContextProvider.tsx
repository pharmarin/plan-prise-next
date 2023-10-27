"use client";

import {
  NavigationActionKind,
  type NavigationAction,
  type NavigationState,
} from "@/types/navigation";
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";

const NavigationContext = createContext<NavigationState>({ title: "" });
const NavigationDispatchContext = createContext<
  Dispatch<NavigationAction> | undefined
>(undefined);

export const useNavigation = () => useContext(NavigationContext);
export const useNavigationDispatch = () =>
  useContext(NavigationDispatchContext);

const initialNavigationState: NavigationState = {
  loading: undefined,
  title: "",
};

const navigationReducer = (
  state: NavigationState,
  action: NavigationAction
) => {
  switch (action.type) {
    case NavigationActionKind.SET_LOADING:
      return { ...state, loading: action.payload };
    case NavigationActionKind.SET_TITLE:
      return { ...state, title: action.payload };
    case NavigationActionKind.SET_RETURNTO:
      return { ...state, returnTo: action.payload };
    default:
      throw new Error("Action invalide");
  }
};

const NavigationContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [navigation, dispatch] = useReducer(
    navigationReducer,
    initialNavigationState
  );

  return (
    <NavigationContext.Provider value={navigation}>
      <NavigationDispatchContext.Provider value={dispatch}>
        {children}
      </NavigationDispatchContext.Provider>
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;
