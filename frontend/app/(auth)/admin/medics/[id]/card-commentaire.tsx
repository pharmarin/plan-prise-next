import { trpc } from "@/utils/api";
import { voiesAdministrationDisplay } from "@/utils/medicament";
import type { VoieAdministration } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@plan-prise/ui/shadcn/ui/button";
import { Card, CardContent } from "@plan-prise/ui/shadcn/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plan-prise/ui/shadcn/ui/select";
import { Textarea } from "@plan-prise/ui/shadcn/ui/textarea";

type Commentaire = {
  id: string;
  texte: string;
  population?: string;
  voieAdministration?: VoieAdministration;
};

const CommentaireCard = ({
  commentaire,
  index,
  removeFromArray,
}: {
  commentaire: Commentaire;
  index: number;
  removeFromArray: (index: number) => void;
}) => {
  const { mutateAsync } = trpc.medics.deleteCommentaire.useMutation();

  const form = useFormContext();

  return (
    <Card>
      <CardContent className="mt-6">
        <Button
          className="float-right h-6 w-6"
          size="icon"
          type="button"
          onClick={async () => {
            try {
              await mutateAsync(commentaire.id);
              removeFromArray(index);
            } catch (error) {
              console.error("Error deleting comment: ", error);
            }
          }}
          variant="ghost"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
        <FormField
          control={form.control}
          name={`commentaires.${index}.texte`}
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
          name={`commentaires.${index}.population`}
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
          name={`commentaires.${index}.voieAdministration`}
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
                        form.resetField(
                          `commentaires.${index}.voieAdministration`,
                        )
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
      </CardContent>
    </Card>
  );
};

export default CommentaireCard;
