"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

import ErrorSkeleton from "@plan-prise/ui/components/pages/ErrorSkeleton";
import { Button } from "@plan-prise/ui/shadcn/ui/button";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorSkeleton
      title="Une erreur est survenue"
      subtitle={error.message || ""}
      action={
        <div className="flex space-x-4">
          <Button onClick={() => reset()}>Réessayer</Button>
          <Button onClick={() => window.location.reload()}>Recharger</Button>
        </div>
      }
    />
  );
};

export default Error;
