import type { PropsWithChildren } from "react";
import React from "react";
import { GlobalProviders } from "@/app/_components/Providers";
import background from "@/public/home-bg.jpg";

import "./globals.css";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="fr">
      <body
        className="flex min-h-screen w-screen flex-col bg-white/30  bg-cover px-2 backdrop-blur-sm"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
};

export default RootLayout;

export const metadata = {
  title: {
    default: "Plan de prise.fr",
    template: `%s • ${process.env.APP_NAME}`,
  },
};
