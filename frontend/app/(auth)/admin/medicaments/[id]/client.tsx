"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/api";
import { revalidatePath } from "@/app/(auth)/admin/actions";
import CommentaireCard from "@/app/(auth)/admin/medicaments/[id]/card-commentaire";
import { useNavigationState } from "@/app/state-navigation";
import { useEventListener } from "@/utils/event-listener";
import { voiesAdministrationDisplay } from "@/utils/medicament";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { capitalize } from "lodash";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { upsertMedicSchema } from "@plan-prise/api/validation/medicaments";
import MultiSelect from "@plan-prise/ui/components/multi-select";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import { Checkbox } from "@plan-prise/ui/shadcn/ui/checkbox";
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
import { Label } from "@plan-prise/ui/shadcn/ui/label";

const EDIT_MEDIC_EVENT = "EDIT_MEDIC_EVENT";
const SAVE_MEDIC_EVENT = "SAVE_MEDIC_EVENT";
const DELETE_MEDIC_EVENT = "DELETE_MEDIC_EVENT";

const MedicClient = ({ medicament }: { medicament: PP.Medicament.Include }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const setNavigation = useNavigationState((state) => state.setNavigation);

  const { mutateAsync: findPrincipeActifs } =
    trpc.medics.findManyPrincipesActifs.useMutation();
  const { mutateAsync: upsertMedic } = trpc.medics.upsert.useMutation();
  const { mutateAsync: deleteMedic } = trpc.medics.delete.useMutation();

  useEventListener(EDIT_MEDIC_EVENT, () => setReadOnly(false));

  useEventListener(SAVE_MEDIC_EVENT, () => setReadOnly(true));

  useEventListener(DELETE_MEDIC_EVENT, async () => {
    if (
      confirm(`Voulez-vous vraiment supprimer ${medicament.denomination} ?`)
    ) {
      await deleteMedic({ id: medicament.id });
      revalidatePath("/admin/medicaments");
      router.push("/admin/medicaments");
    }
  });

  useEffect(() => {
    setNavigation({
      title: readOnly
        ? medicament.denomination
        : `Modification de ${medicament.denomination}`,
      returnTo: "/admin/medicaments",
      options: [
        ...(readOnly
          ? [{ icon: "edit" as const, event: EDIT_MEDIC_EVENT }]
          : []),
        ...(isSaving
          ? [
              {
                icon: "loading" as const,
                className: "animate-spin",
                event: "",
              },
            ]
          : [
              {
                icon: "save" as const,
                event: SAVE_MEDIC_EVENT,
              },
            ]),
        {
          icon: "delete",
          className: "bg-red-500 p-1 rounded-full text-white",
          event: DELETE_MEDIC_EVENT,
        },
      ],
    });
  }, [isSaving, medicament.denomination, readOnly, setNavigation]);

  const form = useForm<z.infer<typeof upsertMedicSchema>>({
    resolver: zodResolver(upsertMedicSchema),
    defaultValues: {
      id: medicament.id,
      denomination: medicament.denomination,
      principesActifs: medicament.principesActifs,
      voiesAdministration: medicament.voiesAdministration,
      indications:
        medicament.indications.map((indication) => ({ value: indication })) ||
        [],
      conservationFrigo: medicament.conservationFrigo,
      conservationDuree: (medicament.conservationDuree ?? []).map(
        (conservation) => ({
          duree: conservation.duree,
          laboratoire: conservation.laboratoire ?? "",
        }),
      ),
      commentaires: medicament.commentaires.map((commentaire) => ({
        ...commentaire,
        population: commentaire.population ?? "",
        voieAdministration: commentaire.voieAdministration ?? "",
      })),
    },
  });

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

  const onSubmit = async (values: z.infer<typeof upsertMedicSchema>) => {
    try {
      setIsSaving(true);
      const response = await upsertMedic(values);
      setIsSaving(false);

      if (response === MUTATION_SUCCESS) {
        setReadOnly(true);

        revalidatePath("/admin/medicaments");
      } else {
        form.setError(SERVER_ERROR, {
          message: "La mise à jour du médicament a échoué",
        });
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }
  };

  return (
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
                    defaultValue={field.value}
                    disabled={readOnly}
                    keys={{ value: "id", label: "denomination" }}
                    onSearchChange={async (value) =>
                      (await findPrincipeActifs(value)) ?? []
                    }
                    onSelect={(values) => field.onChange(values)}
                    placeholder="Principes actifs"
                    searchPlaceholder="Rechercher un principe actif"
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
                    defaultValue={field.value.map((value) => ({
                      label: capitalize(voiesAdministrationDisplay[value]),
                      value,
                    }))}
                    disabled={readOnly}
                    keys={{ label: "label", value: "value" }}
                    onSelect={(values) =>
                      field.onChange(values.map((value) => value.value))
                    }
                    options={Object.entries(voiesAdministrationDisplay).map(
                      ([value, label]) => ({ label, value: capitalize(value) }),
                    )}
                    placeholder="Voie d'administration"
                    searchPlaceholder="Rechercher une voie d'administration"
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
          <div className="w-full space-y-1">
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
          <div className="w-full space-y-1">
            <Label>Commentaires associés</Label>
            <div className="grid grid-cols-3 gap-4">
              {commentairesFieldArray.fields.map((field, index) => (
                <CommentaireCard
                  key={field.id}
                  id={field.id ?? ""}
                  index={index}
                  removeFromArray={(index) =>
                    commentairesFieldArray.remove(index)
                  }
                />
              ))}
            </div>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default MedicClient;
