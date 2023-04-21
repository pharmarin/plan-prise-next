"use client";

import Button from "@/components/forms/inputs/Button";

const Error = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <h2 className="text-bold text-xl">Une erreur est survenue</h2>
      <Button onClick={() => reset()}>Réessayer</Button>
    </div>
  );
};

export default Error;
