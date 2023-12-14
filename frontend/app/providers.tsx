"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { trpc } from "@/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { SessionProvider } from "next-auth/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import SuperJSON from "superjson";

import getUrl from "@plan-prise/api/utils/url";
import { Toaster } from "@plan-prise/ui/shadcn/ui/toaster";

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
