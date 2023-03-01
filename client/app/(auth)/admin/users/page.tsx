"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import DeleteButton from "app/(auth)/admin/users/DeleteButton";
import { trpc } from "common/trpc";
import Spinner from "components/icons/Spinner";
import Pagination from "components/navigation/Pagination";
import Pill from "components/Pill";
import Table from "components/table/Table";
import TableBody from "components/table/TableBody";
import TableCell from "components/table/TableCell";
import TableFooter from "components/table/TableFooter";
import TableHead from "components/table/TableHead";
import TableHeadCell from "components/table/TableHeadCell";
import TableRow from "components/table/TableRow";
import Link from "next/link";
import { useMemo } from "react";
import { AppRouter } from "server/trpc/routers/app";

type User = inferRouterOutputs<AppRouter>["users"]["findMany"][0];

const Users = () => {
  const { data, isLoading, isLoadingError } = trpc.users.findMany.useQuery(
    undefined,
    { initialData: [] }
  );
  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("lastName", { header: "Nom" }),
      columnHelper.accessor("firstName", { header: "Prénom" }),
      columnHelper.accessor("student", {
        cell: (props) =>
          props.row.original.admin ? (
            <Pill className="bg-red-400">Admin</Pill>
          ) : (
            <Pill className="bg-green-400">
              {props.row.original.student ? "Étudiant" : "Pharmacien"}
            </Pill>
          ),
        header: "Statut",
      }),
      columnHelper.accessor("rpps", {
        cell: (props) => {
          if (
            //filter === "pending" &&
            props.row.original.student &&
            !props.row.original.approvedAt
          ) {
            return (
              <Link href={`/admin/users/${props.row.original.id}/certificat`}>
                Justificatif
              </Link>
            );
          }
          return props.row.original.rpps?.toString() || "";
        },
        header: "RPPS",
      }),
      columnHelper.accessor("createdAt", {
        cell: (props) =>
          new Date(props.row.original.createdAt).toLocaleDateString("fr-FR"),
        header: "Inscription",
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <div className="flex flex-row justify-end space-x-2">
            {/* filter === "pending" && (
            <ApproveButton user={user} onSuccess={forceReload} />
          ) */}
            <DeleteButton user={props.row.original} onSuccess={() => {}} />
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  /* if (studentToApprove) {
    return (
      <ApproveStudent
        close={() => setStudentToApprove(undefined)}
        user={studentToApprove}
      />
    );
  } */

  return (
    <div className="flex flex-col space-y-6">
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
            if (isLoading) {
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

            if (isLoadingError) {
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

      {/* <AsyncTable
        filters={{
          pending: {
            label: "Utilisateurs à approuver",
            filter: {
              field: "approvedAt",
              value: "",
            },
          },
          all: { label: "Tous les utilisateurs", filter: undefined },
        }}
        searchKey="lastName"
        sortBy="createdAt"
      /> */}
    </div>
  );
};

export default Users;
