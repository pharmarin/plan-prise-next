"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LinkExpired = () => {
  const router = useRouter();

  return (
    <div>
      <p className="mb-4 text-center text-red-500">Ce lien a expiré.</p>
      <Button onClick={() => router.push("/forgot-password")}>
        Demander un nouveau mot de passe
      </Button>
    </div>
  );
};

export default LinkExpired;
