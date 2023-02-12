"use client";

import store from "lib/redux/store";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default Providers;
