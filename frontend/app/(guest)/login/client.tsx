"use client";

import { useRouter } from "next/navigation";
import { loginSchema } from "@/app/(guest)/login/validation";
import { routes, useSafeSearchParams } from "@/app/routes-schema";
import { env } from "@/env.mjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import PP_Error from "@plan-prise/errors";
import { Button } from "@plan-prise/ui/button";
import Link from "@plan-prise/ui/components/navigation/Link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormServerError,
  SERVER_ERROR,
} from "@plan-prise/ui/form";
import { Input } from "@plan-prise/ui/input";

const LoginForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const { redirect } = useSafeSearchParams("login");

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!executeRecaptcha && !env.CI) {
      throw new PP_Error("RECAPTCHA_LOADING_ERROR");
    }

    const recaptcha =
      executeRecaptcha && (await executeRecaptcha("enquiryFormSubmit"));

    const signInResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      recaptcha,
      redirect: false,
    });

    // If signinResponse has no error, redirection is handled by authGuard to searchParam?redirect ou home

    if (signInResponse?.error) {
      form.setError(SERVER_ERROR, {
        message:
          signInResponse?.error === "CredentialsSignin"
            ? new PP_Error("USER_LOGIN_ERROR").message
            : signInResponse?.error,
      });
    } else {
      router.push(redirect ?? routes.home());
    }
  };

  return (
    <div className="mx-auto md:w-2/3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Adresse mail"
                    required
                    type="email"
                    {...field}
                  />
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
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            className="!mt-1 px-0 py-0 text-xs"
            href={routes.passwordAskReset()}
          >
            Mot de passe oublié ?
          </Link>
          <FormServerError />
          <Button
            className="flex"
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
          >
            Se connecter
          </Button>
        </form>
      </Form>

      <Link className="mt-4" href={routes.register()}>
        Je n&apos;ai pas de compte : S&apos;inscrire
      </Link>
    </div>
  );
};

export default LoginForm;
