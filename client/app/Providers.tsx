"use client";

import store from "lib/redux/store";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
};
export default Providers;
