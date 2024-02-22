import { useState } from "react";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import {
  deleteCommentaireAction,
  upsertCommentaireAction,
} from "@/app/(auth)/admin/medicaments/[medicamentId]/actions";
import { upsertCommentaireFormSchema } from "@/app/(auth)/admin/medicaments/[medicamentId]/validation";
import { voiesAdministrationDisplay } from "@/utils/medicament";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Commentaire, VoieAdministration } from "@prisma/client";
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@plan-prise/ui/button";
import { Card, CardContent } from "@plan-prise/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@plan-prise/ui/form";
import { Input } from "@plan-prise/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plan-prise/ui/select";
import { Textarea } from "@plan-prise/ui/textarea";

const CommentaireCard = ({
  commentaire,
  medicId,
  removeFromArray,
  updateFromArray,
}: {
  commentaire: Partial<Commentaire> & { id: string };
  medicId?: string;
  removeFromArray: () => void;
  updateFromArray: (comment: Commentaire) => void;
}) => {
  const neverSaved = commentaire.id.startsWith("new_");
  const [readOnly, setReadOnly] = useState(!neverSaved);

  const [deleteCommentaireMutation, deleteCommentaire] = useAsyncCallback(
    deleteCommentaireAction,
  );
  const [upsertCommentaireMutation, upsertCommentaire] = useAsyncCallback(
    upsertCommentaireAction,
  );

  const form = useForm<z.infer<typeof upsertCommentaireFormSchema>>({
    resolver: zodResolver(upsertCommentaireFormSchema),
    defaultValues: {
      id: commentaire?.id,
      population: commentaire?.population ?? "",
      voieAdministration: commentaire?.voieAdministration ?? "",
      texte: commentaire?.texte ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof upsertCommentaireFormSchema>,
  ) => {
    setReadOnly(true);
    const commentaire = await upsertCommentaire({ ...values, medicId });
    updateFromArray(commentaire);
  };

  return (
    <Card>
      <CardContent className="relative mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="absolute -top-2 right-6 flex space-x-2">
              {readOnly ? (
                <Button
                  className="h-6 w-6 hover:text-orange-500"
                  size="icon"
                  type="button"
                  onClick={() => setReadOnly(false)}
                  variant="ghost"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="h-6 w-6 hover:text-green-500"
                  loading={upsertCommentaireMutation.isLoading}
                  size="icon"
                  type="submit"
                  variant="ghost"
                >
                  <SaveIcon className="h-4 w-4" />
                </Button>
              )}
              <Button
                loading={deleteCommentaireMutation.isLoading}
                onClick={async () => {
                  if (!commentaire) return;

                  if (!neverSaved) {
                    await deleteCommentaire({ commentaireId: commentaire.id });
                  }

                  removeFromArray();
                }}
                className="h-6 w-6 hover:text-red-500"
                size="icon"
                type="button"
                variant="ghost"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
            <fieldset className="space-y-2" disabled={readOnly}>
              <FormField
                control={form.control}
                name="texte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="population"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Population concernée</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voieAdministration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voie d&apos;administration concernée</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value as VoieAdministration}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              field.value
                                ? `Voie ${voiesAdministrationDisplay[field.value as VoieAdministration]}`
                                : "Toutes voies"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            onClick={() =>
                              form.resetField("voieAdministration")
                            }
                            value={"RESET"}
                          >
                            Toutes les voies
                          </SelectItem>
                          {Object.entries(voiesAdministrationDisplay).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                Voie {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CommentaireCard;
