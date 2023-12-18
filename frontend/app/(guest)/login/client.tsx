"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { loginSchema } from "@plan-prise/api/validation/users";
import PP_Error from "@plan-prise/errors";
import Link from "@plan-prise/ui/components/navigation/Link";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormServerError,
  SERVER_ERROR,
} from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!executeRecaptcha) {
      throw new PP_Error("RECAPTCHA_LOADING_ERROR");
    }

    const recaptcha = await executeRecaptcha("enquiryFormSubmit");

    const signInResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      recaptcha,
      redirect: false,
    }).catch((error) => console.log("error: ", error));

    if (!signInResponse?.error) {
      router.push((searchParams?.get("redirectTo") ?? "/") as Route);
    } else {
      form.setError(
        SERVER_ERROR,
        new PP_Error(
          signInResponse?.error === "CredentialsSignin"
            ? "USER_LOGIN_ERROR"
            : "SERVER_ERROR",
        ),
      );
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse mail</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse mail" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormServerError />
          <Button type="submit">Se connecter</Button>
        </form>
      </Form>
      {/* <Formik
        initialValues={{
          email: "",
          password: "",
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
      </Formik> */}
      <Link className="mt-4" href="/register">
        Je n&apos;ai pas de compte : S&apos;inscrire
      </Link>
    </>
  );
};

export default LoginForm;
