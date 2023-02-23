"use client";

import { User } from "@prisma/client";
import FormInfo from "components/forms/FormInfo";
import Button from "components/forms/inputs/Button";
import ConfirmPasswordModal from "components/overlays/modals/ConfirmPasswordModal";
import { Errors } from "jsonapi-typescript";
import React, { useState } from "react";

const DeleteUser: React.FC<{ id: User["id"] }> = ({ id }) => {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Errors | undefined>(undefined);

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
        errors={errors}
        onCancel={() => setShowForm(false)}
        onSubmit={async (password) => {
          // TODO: await server.verifyPassword()
          /* return await prisma.user
            .delete({ where: { id } })
            .then(() => {
              dispatch(fetchUserAction());
              return true;
            })
            .catch((errors) => {
              setErrors(errors);
              return false;
            }); */
          return false;
          // TODO: Handle errors, user
        }}
        show={showForm}
      />
    </div>
  );
};

export default DeleteUser;
