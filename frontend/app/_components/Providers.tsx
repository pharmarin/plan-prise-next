"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import NavigationContextProvider from "@/components/NavigationContextProvider";
import { Toaster } from "@/components/ui/toaster";
import { trpc } from "@/trpc/client";
import getUrl from "@/utils/url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { SessionProvider } from "next-auth/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import SuperJSON from "superjson";

export const GlobalProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: process.env.NODE_ENV === "test" ? false : 3 },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl("/api/v1"),
        }),
      ],
      transformer: SuperJSON,
    }),
  );

  return (
    <>
      <SessionProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </SessionProvider>
      <Toaster />
    </>
  );
};

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
