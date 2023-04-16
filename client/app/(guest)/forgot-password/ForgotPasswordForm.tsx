"use client";

import Form from "@/components/forms/Form";
import FormSubmitSuccess from "@/components/forms/FormSubmitSuccess";
import Button from "@/components/forms/inputs/Button";
import FormikField from "@/components/forms/inputs/FormikField";
import ServerError from "@/components/forms/ServerError";
import { trpc } from "@/trpc/client";
import { MUTATION_SUCCESS } from "@/trpc/responses";
import PP_Error from "@/utils/errors";
import { forgotPasswordSchema } from "@/validation/users";
import { Formik } from "formik";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ForgotPasswordForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { data, error, mutateAsync } =
    trpc.users.sendPasswordResetLink.useMutation();

  if (data === MUTATION_SUCCESS) {
    return (
      <FormSubmitSuccess
        content={
          <>
            <p>
              Vous recevrez prochainement un mail contenant la procédure à
              suivre pour procéder à la réinitialisation de votre mot de passe.
            </p>
            <p>Pensez à vérifier vos courriers indésirables...</p>
          </>
        }
        title="Demande terminée"
      />
    );
  }

  return (
    <Formik
      initialValues={{
        recaptcha: "",
        email: "",
      }}
      onSubmit={async (values) => {
        if (!executeRecaptcha) {
          throw new PP_Error("RECAPTCHA_LOADING_ERROR");
        }

        const recaptcha = await executeRecaptcha("enquiryFormSubmit");

        await mutateAsync({
          email: values.email,
          recaptcha,
        });
      }}
      validationSchema={forgotPasswordSchema}
    >
      {({ errors, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <h3 className="mb-4 text-center text-lg font-bold">
            Mot de passe oublié
          </h3>

          <FormikField
            id="reset_email"
            label="Adresse mail"
            name="email"
            placeholder="Adresse mail"
            required
            type="email"
          />

          {error && <ServerError error={error} />}

          <Button
            className="mt-4 w-full"
            color="gradient"
            disabled={"email" in errors}
            loading={isSubmitting}
            type="submit"
          >
            Envoyer le mail de réinitialisation
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
