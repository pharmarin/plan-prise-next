"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import type { z } from "zod";

import { confirmPasswordSchema } from "@plan-prise/api/validation/users";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plan-prise/ui/shadcn/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@plan-prise/ui/shadcn/ui/drawer";
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

const DeleteUser = () => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: deleteUser } = trpc.users.deleteCurrent.useMutation();

  const form = useForm<z.infer<typeof confirmPasswordSchema>>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof confirmPasswordSchema>) => {
    try {
      await deleteUser(values);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const ConfirmPasswordTitle = "Supprimer mon compte";

  const ConfirmPasswordTrigger = (
    <Button className="mt-1" variant="destructive">
      Supprimer mon compte
    </Button>
  );

  const ConfirmPasswordTriggerDescription = (
    <p className="mt-1 text-xs text-red-500">
      La suppression de votre compte sera immédiate et ne pourra pas être
      annulée.
    </p>
  );

  const ConfirmPasswordDescription = [
    {
      text: "Nous vous demandons de confirmer votre mot de passe avant de procéder à la suppression de votre compte.",
    },
    {
      text: "Une fois la procédure amorcée, toutes les données rattachées à votre compte seront définitivement supprimées.",
    },
    {
      className: "text-red-500",
      text: "Aucune annulation n'est possible après avoir confirmé la suppression de votre compte.",
    },
  ];

  const ConfirmPasswordForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input
                  autoComplete="current-password"
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
        <FormServerError />
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Button
            className="flex-1"
            loading={isSubmitting}
            type="submit"
            variant="destructive"
          >
            Confirmer
          </Button>
          <Button
            className="flex-1"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{ConfirmPasswordTrigger}</DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{ConfirmPasswordTitle}</DialogTitle>
              {ConfirmPasswordDescription.map((description, index) => (
                <DialogDescription
                  key={index}
                  className={description.className}
                >
                  {description.text}
                </DialogDescription>
              ))}
            </DialogHeader>
            {ConfirmPasswordForm}
          </DialogContent>
        </Dialog>
        {ConfirmPasswordTriggerDescription}
      </div>
    );
  }

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{ConfirmPasswordTrigger}</DrawerTrigger>
        <DrawerContent className="mx-auto max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle>{ConfirmPasswordTitle}</DrawerTitle>
            {ConfirmPasswordDescription.map((description, index) => (
              <DrawerDescription key={index} className={description.className}>
                {description.text}
              </DrawerDescription>
            ))}
          </DrawerHeader>
          {ConfirmPasswordForm}
        </DrawerContent>
      </Drawer>
      {ConfirmPasswordTriggerDescription}
    </div>
  );
};

export default DeleteUser;
