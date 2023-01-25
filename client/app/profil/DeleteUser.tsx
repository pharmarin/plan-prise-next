import FormInfo from "components/forms/FormInfo";
import Button from "components/forms/inputs/Button";
import ConfirmPasswordModal from "components/overlays/modals/ConfirmPasswordModal";
import { Errors } from "jsonapi-typescript";
import { fetchUserAction } from "lib/redux/auth/actions";
import User from "lib/redux/models/User";
import { useDispatch } from "lib/redux/store";
import React, { useState } from "react";

const DeleteUser: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useDispatch();
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
          return user
            .delete({ meta: { password_confirmation: password } })
            .then(() => {
              dispatch(fetchUserAction());
              return true;
            })
            .catch((errors) => {
              setErrors(errors);
              return false;
            });
        }}
        show={showForm}
      />
    </div>
  );
};

export default DeleteUser;
