"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

import { Button } from "@plan-prise/ui/button";
import ErrorSkeleton from "@plan-prise/ui/components/pages/ErrorSkeleton";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="flex min-h-screen w-screen flex-col bg-white/30 bg-cover px-2 backdrop-blur-sm">
        <ErrorSkeleton
          title="Une erreur est survenue"
          subtitle={`${error?.message} (${error?.digest})`}
          action={
            <div className="flex space-x-4">
              <Button onClick={() => reset()}>Réessayer</Button>
              <Button onClick={() => window.location.reload()}>
                Recharger
              </Button>
            </div>
          }
        />
      </body>
    </html>
  );
};

export default Error;
