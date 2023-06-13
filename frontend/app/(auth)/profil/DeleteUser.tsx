"use client";

import FormInfo from "@/components/forms/FormInfo";
import Button from "@/components/forms/inputs/Button";
import ConfirmPasswordModal from "@/components/overlays/modals/ConfirmPasswordModal";
import { trpc } from "@/trpc/client";
import { MUTATION_SUCCESS } from "@/trpc/responses";
import { type User } from "@prisma/client";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

const DeleteUser: React.FC<{ id: User["id"] }> = ({ id }) => {
  const [showForm, setShowForm] = useState(false);

  const { mutateAsync: passwordVerify, error } =
    trpc.users.passwordVerify.useMutation();
  const { mutateAsync: deleteUser } = trpc.users.deleteCurrent.useMutation();

  return (
    <div>
      <Button className="mt-1" color="red" onClick={() => setShowForm(true)}>
        Supprimer mon compte
      </Button>
      <FormInfo color="red">
        La suppression de votre compte sera immédiate et ne pourra pas être
        annulée.
      </FormInfo>
      <ConfirmPasswordModal
        error={error}
        onCancel={() => setShowForm(false)}
        onSubmit={async (password) => {
          try {
            if ((await passwordVerify({ id, password })) === MUTATION_SUCCESS) {
              await deleteUser();
              await signOut({
                redirect: false,
              });

              return true;
            }
          } catch (error) {
            return false;
          }

          return false;
        }}
        show={showForm}
      />
    </div>
  );
};

export default DeleteUser;
