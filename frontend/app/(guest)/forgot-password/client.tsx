"use client";

import { sendPasswordResetLinkAction } from "@/app/(guest)/forgot-password/actions";
import { forgotPasswordSchema } from "@/app/(guest)/forgot-password/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import PP_Error from "@plan-prise/errors";
import { Button } from "@plan-prise/ui/button";
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

const ForgotPasswordForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    result: { data },
    executeAsync: sendPasswordResetLink,
  } = useAction(sendPasswordResetLinkAction);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    mode: "all",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      recaptcha: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      if (!executeRecaptcha) {
        throw new PP_Error("RECAPTCHA_LOADING_ERROR");
      }

      const recaptcha = await executeRecaptcha("enquiryFormSubmit");

      await sendPasswordResetLink({ email: values.email, recaptcha });
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
              Vous recevrez prochainement un mail contenant la procédure à
              suivre pour procéder à la réinitialisation de votre mot de passe.
            </p>
            <p>Pensez à vérifier vos courriers indésirables...</p>
          </>
        }
        title="Demande terminée"
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
        <FormServerError />
        <Button
          className="mt-4 w-full"
          loading={isSubmitting}
          type="submit"
          variant="gradient"
        >
          Envoyer le mail de réinitialisation
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
