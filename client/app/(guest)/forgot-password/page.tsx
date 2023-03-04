"use client";

import ReCaptchaNotLoaded from "@/common/errors/ReCaptchaNotLoaded";
import Form from "@/components/forms/Form";
import Button from "@/components/forms/inputs/Button";
import FormikField from "@/components/forms/inputs/FormikField";
import { Formik } from "formik";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import * as yup from "yup";

const ForgotPassword = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  return (
    <Formik
      initialValues={{
        recaptcha: "",
        email: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        if (!executeRecaptcha) {
          throw new ReCaptchaNotLoaded();
        }

        //const recaptcha = await executeRecaptcha("enquiryFormSubmit");

        try {
          /* TODO
          await new User().forgotPassword({
            email: values.email,
            recaptcha: reCaptchaRef.current?.getValue() || "",
          }); */
        } catch (error) {
          setSubmitting(false);
        }
      }}
      validationSchema={yup.object().shape({
        email: yup.string().email().required().label("Adresse mail"),
      })}
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
            className="mt-4"
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

export default ForgotPassword;
