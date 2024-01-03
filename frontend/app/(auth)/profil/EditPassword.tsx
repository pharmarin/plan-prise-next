"use client";

import ServerError from "@/app/_components/ServerError";
import { trpc } from "@/utils/api";
import type { User } from "@prisma/client";
import { Formik } from "formik";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { updateUserPasswordSchema } from "@plan-prise/api/validation/users";
import Form from "@plan-prise/ui/components/forms/Form";
import FormikField from "@plan-prise/ui/components/forms/inputs/FormikField";
import { Button } from "@plan-prise/ui/shadcn/ui/button";

const EditPassword: React.FC<
  { user: Pick<User, "email"> } | { email: string; token: string }
> = (props) => {
  const { data, mutateAsync, error } = trpc.users.updatePassword.useMutation();

  return (
    <Formik
      initialValues={{
        current_password: "",
        email: "email" in props ? props.email : "",
        password: "",
        password_confirmation: "",
        token: "token" in props ? props.token : "",
      }}
      onSubmit={async (values, { resetForm }) => {
        const response = await mutateAsync({
          current_password: values.current_password,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });

        if (response === MUTATION_SUCCESS) {
          resetForm();
        }
      }}
      validationSchema={updateUserPasswordSchema}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <FormikField
            autoComplete="current-password"
            disableOnSubmit
            displayErrors
            label="Mot de passe actuel"
            name="current_password"
            placeholder="Mot de passe actuel"
            type="password"
          />
          <input
            autoComplete="off"
            name="email"
            type="hidden"
            value={"user" in props ? props.user.email : props.email}
          />
          <FormikField
            autoComplete="new-password"
            disableOnSubmit
            displayErrors
            label="Nouveau mot de passe"
            name="password"
            placeholder="Nouveau mot de passe"
            type="password"
          />
          <FormikField
            autoComplete="new-password"
            disableOnSubmit
            displayErrors
            label="Confirmation"
            name="password_confirmation"
            placeholder="Confirmation du nouveau mot de passe"
            type="password"
          />

          {error && <ServerError error={error} />}

          {data === MUTATION_SUCCESS && (
            <p className="mt-1 text-xs text-green-500">
              Le mot de passe a été mis à jour
            </p>
          )}

          <Button loading={isSubmitting} type="submit">
            Mettre à jour le mot de passe
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditPassword;
