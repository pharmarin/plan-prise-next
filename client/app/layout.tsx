import React, { PropsWithChildren } from "react";
import "./globals.css";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
