"use client";

import { deleteUserAction } from "@/app/(auth)/admin/utilisateurs/actions";

import { Button } from "@plan-prise/ui/button";

const DeleteButton = ({ userId }: { userId: string }) => {
  return (
    <Button
      className="text-red-500"
      onClick={async () => await deleteUserAction({ userId })}
      variant="link"
    >
      Supprimer
    </Button>
  );
};

export default DeleteButton;
