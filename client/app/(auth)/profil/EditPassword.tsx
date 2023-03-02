"use client";

import { trpc } from "@/common/trpc";
import { updateUserPasswordSchema } from "@/common/validation/users";
import Form from "@/components/forms/Form";
import FormInfo from "@/components/forms/FormInfo";
import Button from "@/components/forms/inputs/Button";
import FormikField from "@/components/forms/inputs/FormikField";
import { User } from "@prisma/client";
import { Formik } from "formik";

const EditPassword: React.FC<
  { user: User } | { email: string; token: string }
> = (props) => {
  const { mutateAsync, error } = trpc.users.updatePassword.useMutation();

  return (
    <Formik
      initialValues={{
        current_password: "",
        email: "email" in props ? props.email : "",
        password: "",
        password_confirmation: "",
        token: "token" in props ? props.token : "",
      }}
      onSubmit={async (values) => {
        await mutateAsync({
          current_password: values.current_password,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
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

          {error && (
            <FormInfo color="red">
              Une erreur est survenue pendant l&apos;enregistrement. Veuillez
              vérifier le mot de passe fourni.{" "}
            </FormInfo>
          )}

          <Button color="primary" loading={isSubmitting} type="submit">
            Mettre à jour le mot de passe
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditPassword;
