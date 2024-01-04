"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { resetPasswordSchema } from "@plan-prise/api/validation/users";
import PP_Error from "@plan-prise/errors";
import FormSubmitSuccess from "@plan-prise/ui/components/forms/FormSubmitSuccess";
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

const PasswordResetForm: React.FC<{ token: string; email: string }> = ({
  email,
  token,
}) => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { data, mutateAsync } = trpc.users.resetPassword.useMutation();

  const [credentials] = useState({ email, token });

  useEffect(() => {
    router.push("/password-reset");
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

      await mutateAsync({
        ...credentials,
        password: values.password,
        password_confirmation: values.password_confirmation,
        recaptcha,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
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
            <Link href="/login">Se connecter</Link>
          </>
        }
        title="Réinitialisation du mot de passe terminée"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
