"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import {
  deleteMedicAction,
  findManyPrincipesActifsAction,
  upsertMedicAction,
} from "@/app/(auth)/admin/medicaments/[medicamentId]/actions";
import CommentaireCard from "@/app/(auth)/admin/medicaments/[medicamentId]/card-commentaire";
import { upsertMedicSchema } from "@/app/(auth)/admin/medicaments/[medicamentId]/validation";
import { routes } from "@/app/routes-schema";
import type { NavigationItem } from "@/app/state-navigation";
import { useNavigationState } from "@/app/state-navigation";
import { useEventListener } from "@/utils/event-listener";
import { voiesAdministrationDisplay } from "@/utils/medicament";
import { mergeArray } from "@/utils/merge-array";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import type { Commentaire } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { capitalize } from "lodash-es";
import { PlusIcon, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@plan-prise/ui/button";
import { Card, CardContent } from "@plan-prise/ui/card";
import { Checkbox } from "@plan-prise/ui/checkbox";
import MultiSelect from "@plan-prise/ui/components/multi-select";
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
import { Label } from "@plan-prise/ui/label";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

const EDIT_MEDIC_EVENT = "EDIT_MEDIC_EVENT";
const SAVE_MEDIC_EVENT = "SAVE_MEDIC_EVENT";
const DELETE_MEDIC_EVENT = "DELETE_MEDIC_EVENT";

const MedicClient = ({
  medicament,
}: {
  medicament?: PP.Medicament.Include;
}) => {
  const [readOnly, setReadOnly] = useState(!!medicament);

  const router = useRouter();

  const [{ isLoading: isDeleting }, deleteMedic] =
    useAsyncCallback(deleteMedicAction);

  const setNavigation = useNavigationState((state) => state.setNavigation);

  const form = useForm<z.infer<typeof upsertMedicSchema>>({
    resolver: zodResolver(upsertMedicSchema),
    defaultValues: {
      id: medicament?.id ?? "",
      denomination: medicament?.denomination ?? "",
      principesActifs: medicament?.principesActifs ?? [],
      voiesAdministration: medicament?.voiesAdministration ?? [],
      indications:
        (medicament?.indications ?? []).map((indication) => ({
          value: indication,
        })) || [],
      conservationFrigo: medicament?.conservationFrigo ?? false,
      conservationDuree: (medicament?.conservationDuree ?? []).map(
        (conservation) => ({
          duree: conservation.duree,
          laboratoire: conservation.laboratoire ?? "",
        }),
      ),
      commentaires: (medicament?.commentaires ?? []).map((commentaire) => ({
        commentaireId: commentaire.id,
      })),
    },
  });

  const onSubmit = async (values: z.infer<typeof upsertMedicSchema>) => {
    try {
      const response = await upsertMedicAction(values).then(transformResponse);

      setReadOnly(true);

      if (!medicament) {
        router.push(
          routes.medicament({
            medicamentId: response.id,
          }),
        );
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }
  };

  useEventListener(EDIT_MEDIC_EVENT, () => setReadOnly(false));

  useEventListener(SAVE_MEDIC_EVENT, async () => {
    if (Object.values(form.formState.errors).length > 0) {
      console.error("Errors in form: ", form.formState.errors);
    }

    await form.handleSubmit(onSubmit)();
  });

  useEventListener(DELETE_MEDIC_EVENT, async () => {
    if (
      medicament &&
      confirm(`Voulez-vous vraiment supprimer ${medicament.denomination} ?`)
    ) {
      await deleteMedic({ medicId: medicament.id });
    }
  });

  useEffect(() => {
    setNavigation({
      title: medicament
        ? readOnly
          ? medicament.denomination
          : `Modification de ${medicament.denomination}`
        : "Ajout d'un médicament",
      returnTo: routes.medicaments(),
      options: mergeArray<NavigationItem>(
        form.formState.isSubmitting
          ? {
              icon: "loading" as const,
              className: "animate-spin",
              event: "",
            }
          : medicament &&
              (readOnly
                ? { icon: "edit" as const, event: EDIT_MEDIC_EVENT }
                : {
                    icon: "save" as const,
                    event: SAVE_MEDIC_EVENT,
                  }),
        medicament &&
          (isDeleting
            ? {
                icon: "loading" as const,
                className: "animate-spin",
                event: "",
              }
            : {
                icon: "delete" as const,
                className: "bg-red-500 p-1 rounded-full text-white",
                event: DELETE_MEDIC_EVENT,
              }),
      ),
    });
  }, [
    form.formState.isSubmitting,
    isDeleting,
    medicament,
    readOnly,
    setNavigation,
  ]);

  const indicationsFieldArray = useFieldArray({
    name: "indications",
    control: form.control,
  });

  const conservationDureeFieldArray = useFieldArray({
    name: "conservationDuree",
    control: form.control,
  });

  const commentairesFieldArray = useFieldArray({
    name: "commentaires",
    control: form.control,
    keyName: "fieldId",
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset className="space-y-4" disabled={readOnly}>
            <FormServerError />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="denomination"
              render={({ field }) => (
                <FormItem className="!mt-0">
                  <FormLabel>Dénomination</FormLabel>
                  <FormControl>
                    <Input placeholder="Dénomination" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="principesActifs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principes Actifs</FormLabel>
                  <FormControl>
                    <MultiSelect
                      disabled={readOnly}
                      keys={{ value: "id", label: "denomination" }}
                      onSearchChange={async (value) =>
                        (await findManyPrincipesActifsAction({
                          query: value,
                        }).then(transformResponse)) ?? []
                      }
                      onChange={(values) => field.onChange(values)}
                      placeholder="Principes actifs"
                      searchPlaceholder="Rechercher un principe actif"
                      values={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voiesAdministration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voies d&apos;administration</FormLabel>
                  <FormControl>
                    <MultiSelect
                      disabled={readOnly}
                      keys={{ label: "label", value: "value" }}
                      onChange={(values) =>
                        field.onChange(values.map((value) => value.value))
                      }
                      options={Object.entries(voiesAdministrationDisplay).map(
                        ([value, label]) => ({
                          label,
                          value: capitalize(value),
                        }),
                      )}
                      placeholder="Voie d'administration"
                      searchPlaceholder="Rechercher une voie d'administration"
                      values={field.value.map((value) => ({
                        label: capitalize(voiesAdministrationDisplay[value]),
                        value,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1">
              <Label>Indications</Label>
              {indicationsFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name={`indications.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => indicationsFieldArray.remove(index)}
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => indicationsFieldArray.append({ value: "" })}
                size="sm"
                type="button"
                variant="link"
              >
                Ajouter une indication
              </Button>
            </div>
            <div className="w-full space-y-1">
              <Label>Conservation</Label>
              <FormField
                control={form.control}
                name="conservationFrigo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Se conserve au frigo avant ouverture</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {conservationDureeFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-end space-x-4">
                  <FormField
                    control={form.control}
                    name={`conservationDuree.${index}.duree`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Durée
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`conservationDuree.${index}.laboratoire`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Laboratoire (optionnel)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    onClick={() => conservationDureeFieldArray.remove(index)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() =>
                  conservationDureeFieldArray.append({
                    duree: "",
                    laboratoire: "",
                  })
                }
              >
                Ajouter une durée de conservation
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
      <div className="w-full space-y-1">
        <Label>Commentaires associés</Label>
        <div className="grid grid-cols-3 gap-4">
          {commentairesFieldArray.fields.map((field, index) => (
            <CommentaireCard
              key={field.commentaireId}
              commentaire={{
                ...medicament?.commentaires.find(
                  (commentaire) => commentaire.id === field.commentaireId,
                ),
                id: field.commentaireId,
              }}
              medicId={medicament?.id}
              removeFromArray={() => commentairesFieldArray.remove(index)}
              updateFromArray={(commentaire: Commentaire) => {
                medicament?.commentaires.push(commentaire);
                commentairesFieldArray.update(index, {
                  commentaireId: commentaire.id,
                });
              }}
            />
          ))}
          <Card>
            <CardContent
              className="relative flex h-full min-h-40 cursor-pointer items-center justify-center pt-6"
              onClick={() =>
                commentairesFieldArray.append({
                  commentaireId: `new_${createId()}`,
                })
              }
            >
              <PlusIcon className="h-20 w-20 text-gray-400" />
            </CardContent>
          </Card>
        </div>
      </div>
      {medicament && (
        <div className="mt-4 w-full space-y-1">
          <Label>Plus d&apos;informations</Label>
          <p>
            Créé le{" "}
            {medicament.createdAt.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
            {medicament.updatedAt &&
              ` et mis à jour le ${medicament.updatedAt.toLocaleDateString(
                "fr-FR",
                {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                },
              )}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicClient;
