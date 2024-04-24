"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAsyncCallback } from "@/app/_safe-actions/use-async-hook";
import {
  deletePrincipeActifAction,
  upsertPrincipeActifAction,
} from "@/app/(auth)/admin/principes-actifs/actions";
import { upsertPrincipeActifSchema } from "@/app/(auth)/admin/principes-actifs/validation";
import { routes, useSafeSearchParams } from "@/app/routes-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PrincipeActif } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import PP_Error from "@plan-prise/errors";
import { Button } from "@plan-prise/ui/button";
import { DataTable, DataTableColumnHeader } from "@plan-prise/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@plan-prise/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormServerError,
  SERVER_ERROR,
} from "@plan-prise/ui/form";
import { Input } from "@plan-prise/ui/input";

const PrincipesActifsClient = ({
  principesActifs,
}: {
  principesActifs: PrincipeActif[];
}) => {
  const router = useRouter();
  const { edit: selectedId } = useSafeSearchParams("principesActifs");

  const [{ isLoading: isDeleting }, deletePrincipeActif] = useAsyncCallback(
    deletePrincipeActifAction,
  );

  const columnHelper = createColumnHelper<PrincipeActif>();

  const columns: ColumnDef<PrincipeActif, never>[] = [
    columnHelper.accessor("denomination", {
      cell: ({ row }) =>
        String(row.getValue("denomination") ?? "").toUpperCase(),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dénomination" />
      ),
    }),
  ];

  const form = useForm<z.infer<typeof upsertPrincipeActifSchema>>({
    resolver: zodResolver(upsertPrincipeActifSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    form.reset({
      id: selectedId ?? "",
      denomination:
        principesActifs.find((principeActif) => principeActif.id === selectedId)
          ?.denomination ?? "",
    });
  }, [form, principesActifs, selectedId]);

  const onSubmit = async (
    values: z.infer<typeof upsertPrincipeActifSchema>,
  ) => {
    try {
      await upsertPrincipeActifAction(values);
      router.push(routes.principesActifs());
    } catch (error) {
      if (error instanceof PP_Error) {
        form.setError(SERVER_ERROR, { message: error.message });
      }
    }
  };

  return (
    <>
      {selectedId && (
        <Dialog
          open={!!selectedId}
          onOpenChange={(open) => {
            if (!open) {
              router.push(routes.principesActifs());
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le principe actif</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        key={`id_${selectedId}`}
                        type="hidden"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        key={`denomination_${selectedId}`}
                        placeholder="Dénomination"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
                <FormServerError />
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={async () => {
                      await deletePrincipeActif({
                        principeActifId: selectedId,
                      });
                      router.push(routes.principesActifs());
                    }}
                    variant="destructive"
                    disabled={isDeleting || isSubmitting}
                    loading={isDeleting}
                  >
                    Supprimer
                  </Button>
                  <Button
                    type="submit"
                    disabled={isDeleting || isSubmitting}
                    loading={isSubmitting}
                  >
                    Enregistrer
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      <DataTable
        columns={columns}
        data={principesActifs}
        link={(data) => routes.principesActifs({ search: { edit: data.id } })}
        sortingDefault={[{ id: "denomination", desc: false }]}
      />
    </>
  );
};

export default PrincipesActifsClient;
