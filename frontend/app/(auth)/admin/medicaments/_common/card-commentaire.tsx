import {
  deleteCommentaireAction,
  upsertCommentaireAction,
} from "@/app/(auth)/admin/medicaments/_common/actions";
import { upsertCommentaireFormSchema } from "@/app/(auth)/admin/medicaments/_common/validation";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
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
  draft,
  medicId,
  removeFromArray,
  setDraft,
  updateFromArray,
}: {
  commentaire: Partial<Commentaire> & { id: string };
  draft?: boolean;
  medicId?: string;
  removeFromArray: () => void;
  setDraft: (value: boolean) => void;
  updateFromArray: (comment: Commentaire | undefined) => void;
}) => {
  const [deleteCommentaireMutation, deleteCommentaire] = useAsyncCallback(
    deleteCommentaireAction,
  );
  const [upsertCommentaireMutation, upsertCommentaire] = useAsyncCallback(
    upsertCommentaireAction,
  );

  const form = useForm<z.infer<typeof upsertCommentaireFormSchema>>({
    resolver: zodResolver(upsertCommentaireFormSchema),
    defaultValues: {
      id: commentaire.id,
      population: commentaire?.population ?? "",
      voieAdministration: commentaire?.voieAdministration ?? "",
      texte: commentaire?.texte ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof upsertCommentaireFormSchema>,
  ) => {
    try {
      setDraft(false);
      const response = await upsertCommentaire({
        ...values,
        id: commentaire.id,
        medicId,
      });
      updateFromArray(response);
    } catch (e) {
      setDraft(true);
      console.log("Error saving comment", e);
    }
  };

  return (
    <Card>
      <CardContent className="relative mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="absolute -top-2 right-6 flex space-x-2">
              {!draft ? (
                <Button
                  className="h-6 w-6 hover:text-orange-500"
                  size="icon"
                  type="button"
                  onClick={() => setDraft(true)}
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
                  try {
                    if (!commentaire) return;

                    if (!draft) {
                      await deleteCommentaire({
                        commentaireId: commentaire.id,
                      });
                    }

                    removeFromArray();
                  } catch (e) {
                    console.log("Error deleting comment", e);
                  }
                }}
                className="h-6 w-6 hover:text-red-500"
                size="icon"
                type="button"
                variant="ghost"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
            <fieldset className="space-y-2" disabled={!draft}>
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
