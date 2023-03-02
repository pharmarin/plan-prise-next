"use client";

import { User } from "@prisma/client";
import { trpc } from "common/trpc";
import FormInfo from "components/forms/FormInfo";
import Button from "components/forms/inputs/Button";
import ConfirmPasswordModal from "components/overlays/modals/ConfirmPasswordModal";
import { Errors } from "jsonapi-typescript";
import React, { useState } from "react";

const DeleteUser: React.FC<{ id: User["id"] }> = ({ id }) => {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Errors | undefined>(undefined);

  const { mutateAsync: passwordVerify, error } =
    trpc.auth.passwordVerify.useMutation();
  const { mutateAsync: deleteUser } = trpc.users.delete.useMutation();

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
            if ((await passwordVerify({ id, password })) === "success") {
              await deleteUser(id);

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
