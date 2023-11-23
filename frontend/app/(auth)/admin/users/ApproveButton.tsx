"use client";

import Spinner from "@/components/icons/Spinner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/api";
import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

import type { User } from "@plan-prise/db-prisma";

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
