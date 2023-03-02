"use client";

import ReCaptchaNotLoaded from "@/common/errors/ReCaptchaNotLoaded";
import { loginSchema } from "@/common/validation/auth";
import Form from "@/components/forms/Form";
import FormInfo from "@/components/forms/FormInfo";
import Button from "@/components/forms/inputs/Button";
import FormikField from "@/components/forms/inputs/FormikField";
import { Formik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [errorStatus, setErrorStatus] = useState<number | undefined>(undefined);

  return (
    <>
      <Formik
        initialValues={{
          email: searchParams?.get("email") ?? "",
          password: searchParams?.get("password") ?? "",
        }}
        onSubmit={async (values) => {
          if (!executeRecaptcha) {
            throw new ReCaptchaNotLoaded();
          }

          const recaptcha = await executeRecaptcha("enquiryFormSubmit");

          const signInResponse = await signIn("credentials", {
            email: values.email,
            password: values.password,
            recaptcha,
            redirect: false,
          });

          if (signInResponse?.ok) {
            router.push(searchParams?.get("redirectTo") ?? "/");
          } else {
            setErrorStatus(signInResponse?.status);
          }
        }}
        validateOnMount
        validationSchema={loginSchema}
      >
        {({ errors, handleSubmit, isSubmitting }) => (
          <Form
            className="flex flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <h3 className="mb-4 text-center text-lg font-bold">Connexion</h3>

            <div className="space-y-2">
              <FormikField
                id="login_email"
                label="Adresse mail"
                name="email"
                placeholder="Adresse mail"
                required
                slideLabel
                type="email"
              />
              <FormikField
                id="login_password"
                label="Mot de passe"
                name="password"
                placeholder="Mot de passe"
                required
                slideLabel
                type="password"
              />
              <Button
                className="!mt-1 px-0 py-0 text-xs"
                color="link"
                onClick={() => router.push("/forgot-password")}
              >
                Mot de passe oublié ?
              </Button>
            </div>

            <Button
              className="mt-4"
              color="gradient"
              disabled={"email" in errors || "password" in errors}
              loading={isSubmitting}
              type="submit"
            >
              Se connecter
            </Button>

            {errorStatus && (
              <FormInfo color="red">
                {errorStatus === 401
                  ? "Ces identifiants nous ont pas permis de vous connecter."
                  : "Un problème est survenu lors de la connexion."}
              </FormInfo>
            )}
          </Form>
        )}
      </Formik>
      <Button
        className="mt-4"
        color="link"
        onClick={() => router.push("/register")}
      >
        Je n&apos;ai pas de compte : S&apos;inscrire
      </Button>
    </>
  );
};

export default Login;
