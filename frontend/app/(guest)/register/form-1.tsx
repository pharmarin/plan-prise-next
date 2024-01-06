import convertToBase64 from "@/utils/file-to-base64";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  ALLOWED_UPLOADED_FILE_TYPES,
  registerSchemaCertificate,
  registerSchemaStep1,
} from "@plan-prise/api/validation/users";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import { Checkbox } from "@plan-prise/ui/shadcn/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";
import { Label } from "@plan-prise/ui/shadcn/ui/label";

const RegisterFormStep1 = ({
  formData,
  setFormData,
  setNextStep,
}: {
  formData: z.infer<typeof registerSchemaStep1>;
  setFormData: (values: z.infer<typeof registerSchemaStep1>) => void;
  setNextStep: () => void;
}) => {
  const form = useForm<z.infer<typeof registerSchemaStep1>>({
    mode: "all",
    resolver: zodResolver(registerSchemaStep1),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      rpps: formData.rpps,
      certificate: formData.certificate,
      student: formData.student,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof registerSchemaStep1>> = (
    values,
  ) => {
    setFormData(values);
    setNextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div>
          <h3 className="text-center text-xl font-bold">Inscription</h3>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">
            <span className="font-bold text-gray-500">1/2</span> Votre identité
          </h4>
          <p className="text-sm text-gray-600">
            Permettra de valider votre inscription
          </p>
        </div>
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  autoComplete="family-name"
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
                  autoComplete="given-name"
                  placeholder="Prénom"
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
          name="student"
          render={({ field }) => (
            <FormItem className="space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    form.setValue("rpps", undefined);
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel>Étudiant</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues("student") ? (
          <div className="space-y-1">
            <Label>Justificatif d&apos;études de pharmacie</Label>
            {form.watch("certificate.data") ? (
              <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent py-1 pl-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <span>{form.watch("certificate.fileName")}</span>
                <Button
                  onClick={() => form.resetField("certificate")}
                  variant="ghost"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Input
                  accept={ALLOWED_UPLOADED_FILE_TYPES.join(",")}
                  placeholder="Ajouter un fichier... "
                  type="file"
                  name="_certificate"
                  onChange={async (event) => {
                    try {
                      const file = await registerSchemaCertificate.parseAsync(
                        event.target.files?.[0],
                      );

                      const convertedCertificate = await convertToBase64(file);

                      form.clearErrors("certificate");
                      form.setValue("certificate", {
                        fileName: file.name,
                        data: convertedCertificate,
                      });
                    } catch (error) {
                      form.resetField("certificate");
                      form.setError("certificate", {
                        message:
                          error instanceof z.ZodError
                            ? error.flatten().formErrors[0]
                            : "Impossible de prendre en charge ce fichier",
                      });

                      return null;
                    }
                  }}
                />
                <FormField
                  control={form.control}
                  name="certificate"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        ) : (
          <FormField
            control={form.control}
            name="rpps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° RPPS</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="N° RPPS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Valider</Button>
      </form>
    </Form>
  );
};

export default RegisterFormStep1;
