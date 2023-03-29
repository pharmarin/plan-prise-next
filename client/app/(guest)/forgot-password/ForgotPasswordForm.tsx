"use client";

import Form from "@/components/forms/Form";
import Button from "@/components/forms/inputs/Button";
import FormikField from "@/components/forms/inputs/FormikField";
import { trpc } from "@/trpc/client";
import PP_Error from "@/utils/errors";
import { forgotPasswordSchema } from "@/validation/users";
import { Formik } from "formik";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ForgotPasswordForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { mutateAsync } = trpc.users.sendPasswordResetLink.useMutation();

  return (
    <Formik
      initialValues={{
        recaptcha: "",
        email: "",
      }}
      onSubmit={async (values) => {
        console.log("values: ", values);

        if (!executeRecaptcha) {
          throw new PP_Error("RECAPTCHA_LOADING_ERROR");
        }

        const recaptcha = await executeRecaptcha("enquiryFormSubmit");

        console.log("recaptcha OK");

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
