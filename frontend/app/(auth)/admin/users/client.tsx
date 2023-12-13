"use client";

import Link from "next/link";
import ApproveButton from "@/app/(auth)/admin/users/_components/ApproveButton";
import DeleteButton from "@/app/(auth)/admin/users/_components/DeleteButton";
import { trpc } from "@/utils/api";
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import startCase from "lodash/startCase";
import upperCase from "lodash/upperCase";

import type { RouterOutputs } from "@plan-prise/api";
import Pill from "@plan-prise/ui/components/Pill";
import {
  DataTable,
  DataTableColumnFilter,
  DataTableColumnHeader,
} from "@plan-prise/ui/shadcn/ui/data-table";

type User = RouterOutputs["users"]["all"][0];
type FilterKey = "PENDING" | "ALL";

const isFilteredColumn = (
  filter: DataTableColumnFilter<User>,
  state: ColumnFiltersState,
) => state[0]?.id === filter.column && state[0].value === filter.value;

const UsersClient = () => {
  const { data, isFetching, isError, refetch } = trpc.users.all.useQuery(
    undefined,
    {
      initialData: [],
      refetchOnWindowFocus: false,
    },
  );

  const filters: Record<FilterKey, DataTableColumnFilter<User>> = {
    ALL: {
      column: "approvedAt",
      value: undefined,
      label: "Tous les utilisateurs",
    },
    PENDING: {
      column: "approvedAt",
      value: null,
      label: "Utilisateurs à approuver",
      default: true,
    },
  };

  const columnHelper = createColumnHelper<User>();

  const columns: ColumnDef<User, any>[] = [
    columnHelper.accessor("lastName", {
      cell: ({ getValue }) => upperCase(getValue() ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nom" />
      ),
    }),
    columnHelper.accessor("firstName", {
      cell: ({ getValue }) => startCase(getValue()?.toLowerCase() ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prénom" />
      ),
    }),
    columnHelper.accessor("displayName", {
      cell: ({ getValue }) => startCase(getValue()?.toLowerCase() ?? ""),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Affichage" />
      ),
    }),
    columnHelper.accessor("student", {
      cell: ({ row }) =>
        row.original.admin ? (
          <Pill className="bg-red-400">Admin</Pill>
        ) : row.original.student ? (
          <Pill className="bg-green-400">Étudiant</Pill>
        ) : (
          <Pill className="bg-green-500">Pharmacien</Pill>
        ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
    }),
    columnHelper.accessor("rpps", {
      cell: ({ row, table }) => {
        if (
          isFilteredColumn(filters.PENDING, table.getState().columnFilters) &&
          row.original.student &&
          !row.original.approvedAt
        ) {
          return (
            <Link
              href={`/admin/users/${row.original.id}/certificate`}
              prefetch={false}
            >
              Justificatif
            </Link>
          );
        }
        return row.original?.rpps ? row.original.rpps.toString() : "";
      },
      header: "RPPS",
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
    columnHelper.display({
      id: "actions",
      cell: ({ row, table }) => (
        <div className="flex flex-row justify-end space-x-2">
          {isFilteredColumn(
            filters.PENDING,
            table.getState().columnFilters,
          ) && <ApproveButton user={row.original} onSuccess={refetch} />}
          <DeleteButton user={row.original} onSuccess={refetch} />
        </div>
      ),
    }),
  ];

  return (
    <DataTable columns={columns} data={data} filters={Object.values(filters)} />
  );
};

export default UsersClient;
