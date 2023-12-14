"use client";

import { useRouter } from "next/navigation";
import ServerError from "@/app/_components/ServerError";
import { trpc } from "@/utils/api";
import { Formik } from "formik";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { resetPasswordSchema } from "@plan-prise/api/validation/users";
import Form from "@plan-prise/ui/components/forms/Form";
import FormikField from "@plan-prise/ui/components/forms/inputs/FormikField";
import { Button } from "@plan-prise/ui/shadcn/ui/button";

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
