"use client";

import { Button } from "@/components/ui/button";

const Error = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-bold text-xl">Une erreur est survenue</h2>
      <Button onClick={() => reset()}>Réessayer</Button>
    </div>
  );
};

export default Error;
