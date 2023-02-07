import { CheckIcon } from "@heroicons/react/20/solid";
import Button from "components/forms/inputs/Button";
import Spinner from "components/icons/Spinner";
import User from "lib/redux/models/User";
import React from "react";
import { useAsyncCallback } from "react-async-hook";

const ApproveButton: React.FC<{
  user: User;
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { loading, execute: approveUser } = useAsyncCallback(() => {
    return user.saveWithValues({
      ...user.identifier,
      attributes: {
        approvedAt: new Date().toISOString(),
      },
    });
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
