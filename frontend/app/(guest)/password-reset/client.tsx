"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/app/(guest)/password-reset/actions";
import { resetPasswordSchema } from "@/app/(guest)/password-reset/validation";
import { routes } from "@/app/routes-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import PP_Error from "@plan-prise/errors";
import { Button } from "@plan-prise/ui/button";
import Link from "@plan-prise/ui/components/navigation/Link";
import FormSubmitSuccess from "@plan-prise/ui/components/pages/FormSubmitSuccess";
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

const PasswordResetForm: React.FC<{ token: string; email: string }> = ({
  email,
  token,
}) => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    result: { data },
    executeAsync: resetPassword,
  } = useAction(resetPasswordAction);

  const [credentials] = useState({ email, token });

  useEffect(() => {
    // On mount, hide token from url
    router.replace(routes.passwordReset());
  }, [router]);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    mode: "all",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      ...credentials,
      password: "",
      password_confirmation: "",
      recaptcha: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      if (!executeRecaptcha) {
        throw new PP_Error("RECAPTCHA_LOADING_ERROR");
      }

      const recaptcha = await executeRecaptcha("enquiryFormSubmit");

      await resetPassword({
        ...credentials,
        password: values.password,
        password_confirmation: values.password_confirmation,
        recaptcha,
      });
    } catch (error) {
      if (error instanceof PP_Error) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }
  };

  if (data === MUTATION_SUCCESS) {
    return (
      <FormSubmitSuccess
        content={
          <>
            <p>
              Vous pouvez maintenant vous connecter avec votre nouveau mot de
              passe.
            </p>
            <Link href={routes.login()}>Se connecter</Link>
          </>
        }
        title="Réinitialisation du mot de passe terminée"
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="Nouveau mot de passe"
                  required
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation du nouveau mot de passe</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="Confirmation du nouveau mot de passe"
                  required
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormServerError />
        <Button className="w-full" loading={isSubmitting} type="submit">
          Réinitialiser le mot de passe
        </Button>
      </form>
    </Form>
  );
};
export default PasswordResetForm;
