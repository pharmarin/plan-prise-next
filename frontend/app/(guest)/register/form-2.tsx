"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { registerSchemaStep2 } from "@plan-prise/api/validation/users";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormServerError,
  SERVER_ERROR,
} from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";

const RegisterFormStep2 = ({
  formData,
  serverError,
  setFormData,
  setPreviousStep,
  submitForm,
}: {
  formData: z.infer<typeof registerSchemaStep2>;
  serverError?: string;
  setFormData: Dispatch<SetStateAction<z.infer<typeof registerSchemaStep2>>>;
  setPreviousStep: () => void;
  submitForm: (values: z.infer<typeof registerSchemaStep2>) => Promise<void>;
}) => {
  const form = useForm<z.infer<typeof registerSchemaStep2>>({
    mode: "all",
    resolver: zodResolver(registerSchemaStep2),
    defaultValues: {
      email: formData.email,
      displayName: formData.displayName,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  useEffect(() => {
    form.setError(SERVER_ERROR, { message: serverError });
  }, [form, serverError]);

  const onSubmit = async (values: z.infer<typeof registerSchemaStep2>) => {
    setFormData(values);
    await submitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <h4 className="font-medium text-gray-900">
          <span className="font-bold text-gray-500">2/2</span> Votre profil
        </h4>
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la structure (optionnel)</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Nom de la structure"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Si indiqué, le nom de la structure apparaitra à la place de
                votre nom sur le plan de prise
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse mail</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="Adresse mail"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ne sera jamais utilisée ou diffusée
              </FormDescription>
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
                  autoComplete="new-password"
                  placeholder="Mot de passe"
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
              <FormLabel>Confirmation du mot de passe</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="Confirmation du mot de passe"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormServerError />

        <div className="flex gap-4">
          <Button
            className="flex-none"
            onClick={setPreviousStep}
            variant="outline"
          >
            Retour
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
          >
            Demander mon inscription
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterFormStep2;
