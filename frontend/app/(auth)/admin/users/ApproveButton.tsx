"use client";

import Spinner from "@/components/icons/Spinner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { CheckIcon } from "@heroicons/react/20/solid";
import { type User } from "next-auth";
import React from "react";

const ApproveButton: React.FC<{
  user: Partial<User> & { id: User["id"] };
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { mutateAsync, isLoading } = trpc.users.approve.useMutation();

  return (
    <Button
      disabled={isLoading}
      onClick={async () => {
        try {
          await mutateAsync(user.id);
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de l'approbation de l'utilisateur",
          );
        }
      }}
    >
      {isLoading ? <Spinner /> : <CheckIcon className="h-4 w-4" />}
    </Button>
  );
};

export default ApproveButton;
