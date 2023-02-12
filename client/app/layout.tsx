import Providers from "app/Providers";
import background from "public/home-bg.jpg";
import React, { PropsWithChildren } from "react";
import { setLocale } from "yup";
import { fr } from "yup-locales";
import "./globals.css";

setLocale(fr);

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="fr">
      <body
        className="min-h-screen w-screen bg-white/30  bg-cover backdrop-blur-sm"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
