"use client";

import NavigationContextProvider from "@/components/NavigationContextProvider";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const GlobalProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
);

export const GuestProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""}
    scriptProps={{
      async: false,
      defer: false,
      appendTo: "head",
      nonce: undefined,
    }}
  >
    {children}
  </GoogleReCaptchaProvider>
);

export const AuthProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <NavigationContextProvider>{children}</NavigationContextProvider>
);
