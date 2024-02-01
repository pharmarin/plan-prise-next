"use client";

import { useEffect, useState } from "react";
import CommentaireCard from "@/app/(auth)/admin/medics/[id]/card-commentaire";
import { useNavigationState } from "@/app/state-navigation";
import { trpc } from "@/utils/api";
import { useEventListener } from "@/utils/event-listener";
import { voiesAdministrationDisplay } from "@/utils/medicament";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

import { updateMedicSchema } from "@plan-prise/api/validation/medicaments";
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
} from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";
import { Label } from "@plan-prise/ui/shadcn/ui/label";

const EDIT_MEDIC_EVENT = "EDIT_MEDIC_EVENT";
const SAVE_MEDIC_EVENT = "SAVE_MEDIC_EVENT";

const MedicClient = ({ medicament }: { medicament: PP.Medicament.Include }) => {
  const [readOnly, setReadOnly] = useState(true);

  const setNavigation = useNavigationState((state) => state.setNavigation);

  useEventListener(EDIT_MEDIC_EVENT, () => setReadOnly(false));

  useEventListener(SAVE_MEDIC_EVENT, () => setReadOnly(true));

  useEffect(() => {
    setNavigation({
      title: readOnly
        ? medicament.denomination
        : `Modification de ${medicament.denomination}`,
      options: readOnly
        ? [{ icon: "edit", event: EDIT_MEDIC_EVENT }]
        : [{ icon: "save", event: SAVE_MEDIC_EVENT }],
    });
  }, [medicament.denomination, readOnly, setNavigation]);

  const { mutateAsync } = trpc.medics.findManyPrincipesActifs.useMutation();

  const form = useForm<z.infer<typeof updateMedicSchema>>({
    resolver: zodResolver(updateMedicSchema),
    defaultValues: {
      denomination: medicament.denomination,
      principesActifs: medicament.principesActifs,
      voiesAdministration: medicament.voiesAdministration,
      indications:
        medicament.indications.map((indication) => ({ value: indication })) ||
        [],
      conservationFrigo: medicament.conservationFrigo,
      conservationDuree: medicament.conservationDuree ?? [],
      commentaires: medicament.commentaires.map((commentaire) => ({
        ...commentaire,
        population: commentaire.population ?? undefined,
        voieAdministration: commentaire.voieAdministration ?? undefined,
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
  });

  const onSubmit = (values: z.infer<typeof updateMedicSchema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className="space-y-4" disabled={readOnly}>
          <FormField
            control={form.control}
            name="denomination"
            render={({ field }) => (
              <FormItem>
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
                      (await mutateAsync(value)) ?? []
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
              onClick={() => conservationDureeFieldArray.append({ duree: "" })}
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
                  index={index}
                  commentaire={field}
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
