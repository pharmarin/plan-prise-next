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

  const {
    formState: { isSubmitting, isValid },
  } = form;

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
          <Link className="!mt-1 px-0 py-0 text-xs" href="/forgot-password">
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

      <Link className="mt-4" href="/register">
        Je n&apos;ai pas de compte : S&apos;inscrire
      </Link>
    </>
  );
};

export default LoginForm;
