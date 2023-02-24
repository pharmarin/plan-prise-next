import { CheckIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import Button from "components/forms/inputs/Button";
import Spinner from "components/icons/Spinner";
import React from "react";
import { useAsyncCallback } from "react-async-hook";

const ApproveButton: React.FC<{
  user: User;
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { loading, execute: approveUser } = useAsyncCallback(() => {
    return; // TODO: user.approve();
  });

  return (
    <Button
      color="primary"
      disabled={loading}
      onClick={async () => {
        try {
          await approveUser();
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de l'approbation de l'utilisateur"
          );
        }
      }}
    >
      {loading ? <Spinner /> : <CheckIcon className="h-4 w-4" />}
    </Button>
  );
};

export default ApproveButton;
