"use client";

import type { PropsWithChildren } from "react";
import { env } from "@/env.mjs";
import { SessionProvider } from "next-auth/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { Toaster } from "@plan-prise/ui/toaster";

export const GlobalProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
    </>
  );
};

export const GuestProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""}
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
