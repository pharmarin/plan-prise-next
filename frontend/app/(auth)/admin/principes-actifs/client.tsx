"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/api";
import { revalidatePath } from "@/app/(auth)/admin/actions";
import { routes, useSafeSearchParams } from "@/app/routes-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PrincipeActif } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { TRPCClientError } from "@trpc/client";
import { toUpper } from "lodash-es";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { upsertPrincipeActifSchema } from "@plan-prise/api/validation/medicaments";
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

  const { mutateAsync: deletePrincipeActif, isLoading: isDeleting } =
    trpc.medics.deletePrincipeActif.useMutation();
  const { mutateAsync: upsertPrincipeActif, isLoading } =
    trpc.medics.upsertPrincipeActif.useMutation();

  const columnHelper = createColumnHelper<PrincipeActif>();

  const columns: ColumnDef<PrincipeActif, never>[] = [
    columnHelper.accessor("denomination", {
      cell: ({ row }) => toUpper(row.getValue("denomination") ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dénomination" />
      ),
    }),
  ];

  const form = useForm<z.infer<typeof upsertPrincipeActifSchema>>({
    resolver: zodResolver(upsertPrincipeActifSchema),
  });

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
      await upsertPrincipeActif(values);
      revalidatePath(routes.principesActifs());
      router.push(routes.principesActifs());
    } catch (error) {
      if (error instanceof TRPCClientError) {
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
                      await deletePrincipeActif({ id: selectedId });
                      revalidatePath(routes.principesActifs());
                      router.push(routes.principesActifs());
                    }}
                    variant="destructive"
                    disabled={isDeleting || isLoading}
                    loading={isDeleting}
                  >
                    Supprimer
                  </Button>
                  <Button
                    type="submit"
                    disabled={isDeleting || isLoading}
                    loading={isLoading}
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
