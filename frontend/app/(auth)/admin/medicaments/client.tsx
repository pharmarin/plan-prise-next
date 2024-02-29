"use client";

import { routes } from "@/app/routes-schema";
import type { PrincipeActif } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { toUpper } from "lodash-es";

import { Badge } from "@plan-prise/ui/badge";
import { DataTable, DataTableColumnHeader } from "@plan-prise/ui/data-table";

const MedicsClient = ({
  medicaments,
}: {
  medicaments: Omit<PP.Medicament.Include, "commentaires">[];
}) => {
  const columnHelper =
    createColumnHelper<Omit<PP.Medicament.Include, "commentaires">>();

  const columns: ColumnDef<
    Omit<PP.Medicament.Include, "commentaires">,
    never
  >[] = [
    columnHelper.accessor("denomination", {
      cell: ({ row }) => toUpper(row.getValue("denomination") ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dénomination" />
      ),
    }),
    columnHelper.accessor("principesActifs", {
      cell: ({ row }) => (
        <div className="space-x-2">
          {row
            .getValue<PrincipeActif[]>("principesActifs")
            .map((principeActif) => (
              <Badge key={principeActif.id} variant="outline">
                {principeActif.denomination}
              </Badge>
            ))}
        </div>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Principe actifs" />
      ),
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={medicaments}
      link={(data) => routes.medicament({ medicamentId: data.id })}
      sortingDefault={[{ id: "denomination", desc: false }]}
    />
  );
};

export default MedicsClient;
