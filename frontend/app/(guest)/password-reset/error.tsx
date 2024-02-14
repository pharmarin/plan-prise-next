"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/app/routes-schema";
import { AlertCircle } from "lucide-react";

import { Button } from "@plan-prise/ui/button";

const LinkExpired = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center space-y-4">
      <div className="flex items-center justify-center space-x-2 text-red-500">
        <AlertCircle className="h-4 w-4" />
        <p className="text-center">Ce lien a expiré</p>
      </div>
      <Button onClick={() => router.push(routes.passwordAskReset())}>
        Demander un nouveau mot de passe
      </Button>
    </div>
  );
};

export default LinkExpired;
