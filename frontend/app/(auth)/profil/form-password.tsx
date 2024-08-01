"use client";

import { updateCurrentUserPasswordAction } from "@/app/(auth)/profil/actions";
import { updateUserPasswordSchema } from "@/app/(auth)/profil/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import PP_Error from "@plan-prise/errors";
import { Button } from "@plan-prise/ui/button";
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

const EditPassword = () => {
  const {
    result: { data },
    executeAsync: updateCurrentUserPassword,
  } = useAction(updateCurrentUserPasswordAction);

  const form = useForm<z.infer<typeof updateUserPasswordSchema>>({
    resolver: zodResolver(updateUserPasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof updateUserPasswordSchema>) => {
    try {
      await updateCurrentUserPassword(values);
    } catch (error) {
      if (error instanceof PP_Error) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input
                  autoComplete="current-password"
                  placeholder="Mot de passe actuel"
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
        {data === MUTATION_SUCCESS && (
          <p className="mt-1 text-xs text-green-500">
            Le mot de passe a été mis à jour
          </p>
        )}
        <Button loading={isSubmitting} type="submit">
          Mettre à jour le mot de passe
        </Button>
      </form>
    </Form>
  );
};

export default EditPassword;
