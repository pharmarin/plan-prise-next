"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@/components/forms/Form";
import FormikField from "@/components/forms/inputs/FormikField";
import ServerError from "@/components/forms/ServerError";
import Link from "@/components/navigation/Link";
import { Button } from "@/components/ui/button";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Formik } from "formik";
import { signIn } from "next-auth/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import type { AppRouter } from "@plan-prise/api";
import { loginSchema } from "@plan-prise/api/validation/users";
import PP_Error from "@plan-prise/errors";

const LoginForm = () => {
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

          console.log("signInResponse: ", signInResponse);

          if (!signInResponse?.error) {
            router.push((searchParams?.get("redirectTo") ?? "/") as Route);
          } else {
            setError(
              new PP_Error(
                signInResponse?.error === "CredentialsSignin"
                  ? "USER_LOGIN_ERROR"
                  : "SERVER_ERROR",
              ).toTRPCError(),
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
              <Link className="!mt-1 px-0 py-0 text-xs" href="/forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              className="mt-4"
              disabled={"email" in errors || "password" in errors}
              loading={isSubmitting}
              type="submit"
              variant="gradient"
            >
              Se connecter
            </Button>

            {error && <ServerError error={error} />}
          </Form>
        )}
      </Formik>
      <Link className="mt-4" href="/register">
        Je n&apos;ai pas de compte : S&apos;inscrire
      </Link>
    </>
  );
};

export default LoginForm;
