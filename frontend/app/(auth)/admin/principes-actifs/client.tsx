"use client";

import type { PrincipeActif } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { toUpper } from "lodash";

import {
  DataTable,
  DataTableColumnHeader,
} from "@plan-prise/ui/shadcn/ui/data-table";

const PrincipesActifsClient = ({
  principesActifs,
}: {
  principesActifs: PrincipeActif[];
}) => {
  const columnHelper = createColumnHelper<PrincipeActif>();

  const columns: ColumnDef<PrincipeActif, never>[] = [
    columnHelper.accessor("denomination", {
      cell: ({ row }) => toUpper(row.getValue("denomination") ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dénomination" />
      ),
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={principesActifs}
      link={(data) => `/admin/principes-actifs/${data.id}`}
      sortingDefault={[{ id: "denomination", desc: false }]}
    />
  );
};

export default PrincipesActifsClient;
