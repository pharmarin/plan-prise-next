"use client";

import { Button } from "@plan-prise/ui/button";

const RPPSField = ({ rpps }: { rpps: string }) => {
  return (
    <Button
      className="cursor-pointer"
      onClick={async () => {
        await navigator.clipboard.writeText(rpps);
        window.open("https://annuaire.sante.fr");
      }}
      variant="link"
    >
      {rpps}
    </Button>
  );
};

export default RPPSField;
