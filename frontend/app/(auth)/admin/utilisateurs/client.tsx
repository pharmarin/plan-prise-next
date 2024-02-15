"use client";

import type { CleanUser } from "@/app/(auth)/admin/utilisateurs/page";
import { routes } from "@/app/routes-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import startCase from "lodash-es/startCase";
import upperCase from "lodash-es/upperCase";

import { Badge } from "@plan-prise/ui/badge";
import type { DataTableColumnFilter } from "@plan-prise/ui/data-table";
import { DataTable, DataTableColumnHeader } from "@plan-prise/ui/data-table";

type FilterKey = "PENDING" | "ALL";

const UsersClient = ({ users }: { users: CleanUser[] }) => {
  const filters: Record<FilterKey, DataTableColumnFilter<CleanUser>> = {
    ALL: {
      column: "approvedAt",
      value: undefined,
      label: "Tous les utilisateurs",
    },
    PENDING: {
      column: "approvedAt",
      value: null,
      label: "Utilisateurs à approuver",
      default: users.filter((user) => !user.approvedAt).length > 0,
    },
  };

  const columnHelper = createColumnHelper<CleanUser>();

  const columns: ColumnDef<CleanUser, never>[] = [
    columnHelper.accessor("lastName", {
      cell: ({ row }) => upperCase(row.getValue("lastName") ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nom" />
      ),
    }),
    columnHelper.accessor("firstName", {
      cell: ({ row }) => startCase(row.getValue("firstName") ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prénom" />
      ),
    }),
    columnHelper.accessor("displayName", {
      cell: ({ row }) => startCase(row.getValue("displayName") ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Affichage" />
      ),
    }),
    columnHelper.accessor("student", {
      cell: ({ row }) =>
        row.original.admin ? (
          <Badge className="bg-red-400">Admin</Badge>
        ) : row.original.student ? (
          <Badge className="bg-green-400">Étudiant</Badge>
        ) : (
          <Badge className="bg-green-500">Pharmacien</Badge>
        ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
    }),
    columnHelper.accessor("createdAt", {
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("fr-FR"),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inscription" />
      ),
    }),
    columnHelper.accessor("approvedAt", {
      cell: ({ row }) =>
        row.original.approvedAt
          ? new Date(row.original.approvedAt).toLocaleDateString("fr-FR")
          : undefined,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Validation" />
      ),
      filterFn: (row) => !row.original.approvedAt,
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      filters={Object.values(filters)}
      link={(data) => routes.user({ userId: data.id })}
    />
  );
};

export default UsersClient;
