"use client";

import Form from "@/components/forms/Form";
import FormikField from "@/components/forms/inputs/FormikField";
import ServerError from "@/components/forms/ServerError";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { MUTATION_SUCCESS } from "@/trpc/responses";
import { resetPasswordSchema } from "@/validation/users";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

const PasswordResetForm: React.FC<{ token: string; email: string }> = ({
  email,
  token,
}) => {
  const router = useRouter();
  const { data, error, mutateAsync } = trpc.users.resetPassword.useMutation();

  if (data === MUTATION_SUCCESS) {
    router.push("/password-reset?success");
  }

  return (
    <Formik
      initialValues={{
        token,
        email,
        password: "",
        password_confirmation: "",
      }}
      onSubmit={async (values) => {
        await mutateAsync({
          password: values.password,
          password_confirmation: values.password_confirmation,
          token,
          email,
        });
      }}
      validationSchema={resetPasswordSchema}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <input autoComplete="off" name="email" type="hidden" value={email} />
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

          <Button className="w-full" loading={isSubmitting} type="submit">
            Réinitialiser le mot de passe
          </Button>
        </Form>
      )}
    </Formik>
  );
};
export default PasswordResetForm;
