"use client";

import AuthGuard from "components/guards/AuthGuard";
import Navbar from "components/navigation/Navbar";
import store from "lib/redux/store";
import background from "public/home-bg.jpg";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import "./globals.css";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <html lang="fr">
        <body
          className="bg-cover"
          style={{ backgroundImage: `url(${background.src})` }}
        >
          <div className="min-h-screen w-screen bg-gray-200 bg-opacity-30">
            <AuthGuard>
              <>
                <Navbar />
                <div className="container mx-auto">{children}</div>
              </>
            </AuthGuard>
          </div>
        </body>
      </html>
    </Provider>
  );
};

export default RootLayout;
