"use client";

import Form from "components/forms/Form";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import { Formik } from "formik";
import User from "lib/redux/models/User";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import * as yup from "yup";

const ForgotPassword = () => {
  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <Formik
      initialValues={{
        recaptcha: "",
        email: "",
      }}
      onSubmit={async (values, { setSubmitting }) => {
        if (!reCaptchaRef) {
          throw new Error("Le service ReCAPTCHA n'a pas pu être chargé");
        }

        if (!reCaptchaRef.current?.getValue()) {
          await (reCaptchaRef.current as ReCAPTCHA).executeAsync();
        }

        try {
          await new User().forgotPassword({
            email: values.email,
            recaptcha: reCaptchaRef.current?.getValue() || "",
          });
        } catch (error) {
          setSubmitting(false);
        }

        reCaptchaRef.current?.reset();
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

          <ReCAPTCHA
            ref={reCaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""}
          />

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
