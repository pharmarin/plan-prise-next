"use client";

import { trpc } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { z } from "zod";

import { updateUserSchema } from "@plan-prise/api/validation/users";
import { Avatar, AvatarFallback } from "@plan-prise/ui/shadcn/ui/avatar";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@plan-prise/ui/shadcn/ui/dialog";
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
import { Label } from "@plan-prise/ui/shadcn/ui/label";

const EditInformations: React.FC<{
  user: Pick<
    User,
    | "id"
    | "firstName"
    | "lastName"
    | "displayName"
    | "email"
    | "rpps"
    | "student"
  >;
}> = ({ user }) => {
  const trpcContext = trpc.useUtils();
  const { mutateAsync } = trpc.users.update.useMutation();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    mode: "all",
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      rpps: user.rpps?.toString() ?? "",
      student: user.student ?? false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      await mutateAsync({ id: user.id, ...values });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }

    await trpcContext.users.current.invalidate();
  };

  if (!user) {
    return <span>Erreur lors du chargement... </span>;
  }

  return (
    <>
      <Dialog
        defaultOpen={
          (user.firstName ?? "").length === 0 &&
          (user.lastName ?? "").length === 0
        }
      >
        <DialogContent>
          <DialogHeader>Information importante</DialogHeader>
          <div className="flex space-x-4">
            <div>
              <Avatar>
                <AvatarFallback className="bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-4">
              <DialogDescription>
                Suite à des changements sur le site plandeprise.fr nous avons
                besoin de connaitre votre nom et votre prénom.
              </DialogDescription>
              <DialogDescription>
                Ils apparaitront sur les plans de prise ou calendriers exportés
                sauf si vous remplissez le champ &quot;Nom de la
                structure&quot;.
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="last-name"
                    placeholder="Nom"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="first-name"
                    placeholder="Prénom"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-1">
            <Label>Statut</Label>
            <Input
              disabled
              name="student"
              value={form.getValues("student") ? "Étudiant" : "Pharmacien"}
            />
          </div>
          {form.getValues("student") ? (
            <Button
              className={twMerge("mt-2")}
              onClick={() => form.setValue("student", false)}
              variant="link"
            >
              Modifier en compte pharmacien
            </Button>
          ) : (
            <FormField
              control={form.control}
              name="rpps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° RPPS</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="N° RPPS"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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

          <Button loading={isSubmitting} type="submit">
            Mettre à jour les informations
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditInformations;
