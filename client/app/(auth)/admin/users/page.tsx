"use client";

import ApproveButton from "@/app/(auth)/admin/users/ApproveButton";
import DeleteButton from "@/app/(auth)/admin/users/DeleteButton";
import TextInput from "@/components/forms/inputs/TextInput";
import Spinner from "@/components/icons/Spinner";
import Pagination from "@/components/navigation/Pagination";
import Dropdown from "@/components/overlays/Dropdown";
import Pill from "@/components/Pill";
import Table from "@/components/table/Table";
import TableBody from "@/components/table/TableBody";
import TableCell from "@/components/table/TableCell";
import TableFooter from "@/components/table/TableFooter";
import TableHead from "@/components/table/TableHead";
import TableHeadCell from "@/components/table/TableHeadCell";
import TableRow from "@/components/table/TableRow";
import { trpc } from "@/trpc/client";
import { RouterOutputs } from "@/trpc/types";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { debounce, startCase, upperCase } from "lodash";
import Link from "next/link";
import { useMemo, useState } from "react";

type User = RouterOutputs["users"]["all"][0];

const fuzzyFilter: FilterFn<User> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const filters: {
  [key: string]: { label: string; filter: ColumnFiltersState };
} = {
  all: { label: "Tous les utilisateurs", filter: [] },
  pending: {
    label: "Utilisateurs à valider",
    filter: [{ id: "approvedAt", value: undefined }],
  },
};

const Users = () => {
  const { data, isFetching, isError, refetch } = trpc.users.all.useQuery(
    undefined,
    {
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );
  const columnHelper = createColumnHelper<User>();
  const [columnFilter, setColumnFilter] = useState<keyof typeof filters>(
    Object.keys(filters)[0]
  );
  const [globalFilter, setGlobalFilter] = useState("");

  const setGlobalFilterDebounced = debounce((query: string) => {
    setGlobalFilter(query);
  }, 1000);

  const columns = useMemo(
    () => [
      columnHelper.accessor("lastName", {
        cell: (props) => upperCase(props.getValue() || ""),
        header: "Nom",
      }),
      columnHelper.accessor("firstName", {
        cell: (props) => startCase(props.getValue()?.toLowerCase() || ""),
        header: "Prénom",
      }),
      columnHelper.accessor("displayName", {
        cell: (props) => startCase(props.getValue()?.toLowerCase() || ""),
        header: "Affichage",
      }),
      columnHelper.accessor("student", {
        cell: (props) =>
          props.row.original.admin ? (
            <Pill className="bg-red-400">Admin</Pill>
          ) : props.row.original.student ? (
            <Pill className="bg-green-400">Étudiant</Pill>
          ) : (
            <Pill className="bg-green-500">Pharmacien</Pill>
          ),
        header: "Statut",
      }),
      columnHelper.accessor("rpps", {
        cell: (props) => {
          if (
            columnFilter === "pending" &&
            props.row.original.student &&
            !props.row.original.approvedAt
          ) {
            return (
              <Link
                href={`/admin/users/${props.row.original.id}/certificate`}
                prefetch={false}
              >
                Justificatif
              </Link>
            );
          }
          return props.row.original?.rpps
            ? props.row.original.rpps.toString()
            : "";
        },
        header: "RPPS",
      }),
      columnHelper.accessor("createdAt", {
        cell: (props) =>
          new Date(props.row.original.createdAt).toLocaleDateString("fr-FR"),
        header: "Inscription",
      }),
      columnHelper.accessor("approvedAt", {
        cell: (props) =>
          props.row.original.approvedAt
            ? new Date(props.row.original.approvedAt).toLocaleDateString(
                "fr-FR"
              )
            : undefined,
        header: "Validation",
        filterFn: (row) => !row.original.approvedAt,
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <div className="flex flex-row justify-end space-x-2">
            {columnFilter === "pending" && (
              <ApproveButton user={props.row.original} onSuccess={refetch} />
            )}
            <DeleteButton user={props.row.original} onSuccess={refetch} />
          </div>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper]
  );

  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    state: {
      columnFilters: filters[columnFilter].filter,
      columnVisibility: {
        approvedAt: false,
      },
      globalFilter,
    },
  });

  /* useEffect(() => {
     // TODO: useContext
    dispatch(
      setNavigation("Utilisateurs", {
        component: { name: "arrowLeft" },
        path: "/admin",
      })
    ); 
  }); */

  return (
    <div className="flex flex-col space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 pr-4">
          <div className="relative md:w-1/3">
            <TextInput
              className="border-0 py-2 pl-10 pr-4 shadow-md"
              name="search"
              onChange={(event) => {
                event.currentTarget.value.length > 0
                  ? setGlobalFilterDebounced(event.currentTarget.value)
                  : setGlobalFilter("");
              }}
              placeholder="Rechercher..."
              type="search"
            />
            <div className="absolute left-0 top-0 inline-flex items-center p-2">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        {Object.keys(filters).length > 0 && (
          <Dropdown
            buttonContent={
              <span className="flex align-middle">
                {filters[columnFilter].label}
                <ChevronDownIcon className="ml-1 mt-1 h-4 w-4" />
              </span>
            }
            buttonProps={{
              className:
                "py-2 px-3 bg-white shadow-md rounded-lg text-gray-600 font-medium",
            }}
            items={Object.keys(filters).map((key) => ({
              label: filters[key].label,
              action: () => {
                setColumnFilter(key);
                table.setPageIndex(0);
              },
            }))}
          />
        )}
      </div>

      <Table className="text-center">
        <TableHead>
          <TableRow>
            {table.getFlatHeaders().map((header) => (
              <TableHeadCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(() => {
            if (isFetching) {
              return (
                <TableRow stripped>
                  <TableCell colSpan={columns.length}>
                    <div className="flex justify-center align-middle text-gray-600">
                      <Spinner />
                      <span className="ml-4">Chargement en cours...</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (isError) {
              return (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="text-center text-red-600">
                      Une erreur est survenue pendant le chargement
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (data.length === 0) {
              return (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex justify-center align-middle text-gray-600">
                      La recherche n&apos;a rien retourné
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            return table.getRowModel().rows.map((row) => (
              <TableRow className="flex-col sm:flex-row" key={row.id} stripped>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ));
          })()}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <Pagination
                getCanNextPage={table.getCanNextPage}
                getCanPreviousPage={table.getCanPreviousPage}
                getPageCount={table.getPageCount}
                getState={table.getState}
                nextPage={table.nextPage}
                previousPage={table.previousPage}
                setPageIndex={table.setPageIndex}
                setPageSize={table.setPageSize}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Users;
