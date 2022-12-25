"use client";

import Welcome from "components/containers/Welcome";
import { useAuth } from "lib/useAuth";
import Link from "next/link";
import background from "public/home-bg.jpg";
import React, { PropsWithChildren } from "react";
import "./globals.css";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  return (
    <html lang="fr">
      <body
        className="bg-cover"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <div className="min-h-screen w-screen bg-gray-200 bg-opacity-30">
          {user ? (
            <>
              <div className="py-2">
                <div className="container mx-auto flex justify-between rounded-lg bg-white p-4">
                  <Link
                    className="flex flex-row overflow-hidden rounded-full font-bold shadow-lg"
                    href="/"
                  >
                    <div className="bg-white py-1 pl-2 pr-0.5 text-gray-900">
                      Plan de
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pr-2 pl-0.5 text-white">
                      prise
                    </div>
                  </Link>
                  <div>{user.display_name}</div>
                </div>
              </div>
              {children}
            </>
          ) : (
            <Welcome />
          )}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
