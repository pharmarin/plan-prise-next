"use client";

import AuthGuard from "components/guards/AuthGuard";
import Navbar from "components/navigation/Navbar";
import store from "lib/redux/store";
import background from "public/home-bg.jpg";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { setLocale } from "yup";
import { fr } from "yup-locales";
import "./globals.css";

setLocale(fr);

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <html lang="fr">
        <body
          className="min-h-screen w-screen bg-white/30  bg-cover backdrop-blur-sm"
          style={{ backgroundImage: `url(${background.src})` }}
        >
          <AuthGuard>
            <>
              <Navbar />
              <div className="container mx-auto overflow-hidden rounded-lg bg-white p-4 pb-8">
                {children}
              </div>
            </>
          </AuthGuard>
        </body>
      </html>
    </Provider>
  );
};

export default RootLayout;
