import { GlobalProviders } from "@/app/Providers";
import background from "public/home-bg.jpg";
import React, { type PropsWithChildren } from "react";
import "./globals.css";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="fr">
      <body
        className="min-h-screen w-screen bg-white/30  bg-cover backdrop-blur-sm"
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
