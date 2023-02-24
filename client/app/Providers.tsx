"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { getBaseUrl, trpc } from "common/trpc";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/v1`,
        }),
      ],
    })
  );

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
};
export default Providers;
