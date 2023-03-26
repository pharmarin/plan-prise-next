"use client";

import Form from "@/components/forms/Form";
import Button from "@/components/forms/inputs/Button";
import FormikField from "@/components/forms/inputs/FormikField";
import ServerError from "@/components/forms/ServerError";
import { type AppRouter } from "@/trpc/routers/app";
import PP_Error from "@/utils/errors";
import { loginSchema } from "@/validation/users";
import { type TRPCClientErrorLike } from "@trpc/client";
import { Formik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [error, setError] = useState<
    TRPCClientErrorLike<AppRouter> | undefined
  >(undefined);

  return (
    <>
      <Formik
        initialValues={{
          email: searchParams?.get("email") ?? "",
          password: searchParams?.get("password") ?? "",
        }}
        onSubmit={async (values) => {
          if (!executeRecaptcha) {
            throw new PP_Error("RECAPTCHA_LOADING_ERROR");
          }

          const recaptcha = await executeRecaptcha("enquiryFormSubmit");

          const signInResponse = await signIn("credentials", {
            email: values.email,
            password: values.password,
            recaptcha,
            redirect: false,
          });

          console.error("error: ", signInResponse?.error);

          if (signInResponse?.ok) {
            router.push(searchParams?.get("redirectTo") ?? "/");
          } else {
            setError(
              new PP_Error(
                signInResponse?.error === "CredentialsSignin"
                  ? "USER_LOGIN_ERROR"
                  : "SERVER_ERROR"
              ).toTRPCError()
            );
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

            {error && <ServerError error={error} />}
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
