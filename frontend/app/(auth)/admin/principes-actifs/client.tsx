"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/api";
import { revalidatePath } from "@/app/(auth)/admin/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PrincipeActif } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { TRPCClientError } from "@trpc/client";
import { toUpper } from "lodash";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { upsertPrincipeActifSchema } from "@plan-prise/api/validation/medicaments";
import { Button } from "@plan-prise/ui/shadcn/ui/button";
import {
  DataTable,
  DataTableColumnHeader,
} from "@plan-prise/ui/shadcn/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@plan-prise/ui/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormServerError,
  SERVER_ERROR,
} from "@plan-prise/ui/shadcn/ui/form";
import { Input } from "@plan-prise/ui/shadcn/ui/input";

const EDIT_SEARCH_PARAM = "edit";

const PrincipesActifsClient = ({
  principesActifs,
}: {
  principesActifs: PrincipeActif[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.has(EDIT_SEARCH_PARAM)
    ? searchParams.get(EDIT_SEARCH_PARAM)
    : null;

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
      revalidatePath("/admin/principes-actifs");
      router.push("/admin/principes-actifs");
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
              router.push("/admin/principes-actifs");
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
                      revalidatePath("/admin/principes-actifs");
                      router.push("/admin/principes-actifs");
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
        link={(data) =>
          `/admin/principes-actifs/?${EDIT_SEARCH_PARAM}=${data.id}`
        }
        sortingDefault={[{ id: "denomination", desc: false }]}
      />
    </>
  );
};

export default PrincipesActifsClient;
