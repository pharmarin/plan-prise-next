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
          className="bg-cover"
          style={{ backgroundImage: `url(${background.src})` }}
        >
          <div className="min-h-screen w-screen bg-gray-200 bg-opacity-30 pb-8">
            <AuthGuard>
              <>
                <Navbar />
                <div className="container mx-auto overflow-hidden rounded-lg bg-white p-4">
                  {children}
                </div>
              </>
            </AuthGuard>
          </div>
        </body>
      </html>
    </Provider>
  );
};

export default RootLayout;
