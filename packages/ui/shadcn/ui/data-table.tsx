"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import { DataTablePagination } from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export type DataTableColumnFilter<TData> = {
  column: Extract<keyof TData, string>;
  value: any;
  label: string;
  default?: boolean;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: DataTableColumnFilter<TData>[];
  link?: (data: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  link,
}: DataTableProps<TData, TValue>) {
  const defaultColumnFilter = (filters || [])
    .filter((filter) => filter.default === true)
    .filter((_, index) => index === 0);

  const [globalFilter, setGlobalFilter] = useState<"">("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    defaultColumnFilter.map((filter) => ({
      id: filter.column,
      value: filter.value,
    })),
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {filters && (
          <Select
            defaultValue={defaultColumnFilter[0]?.label}
            onValueChange={(value) => {
              const filter = filters.find((fil) => fil.label === value);

              if (
                typeof filter?.column !== "string" ||
                filter.value === undefined
              ) {
                table.resetColumnFilters();
                return;
              }

              setColumnFilters([{ id: filter?.column, value: filter?.value }]);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              {filters.map((filter, index) => (
                <SelectItem
                  key={index}
                  value={filter.label}
                  onClick={() =>
                    setColumnFilters([
                      { id: filter.column, value: filter.value },
                    ])
                  }
                >
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn({ "cursor-pointer": link !== undefined })}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    link ? router.push(link(row.original)) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  menu?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  menu,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  if (menu) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => {
        column.getIsSorted() === "desc"
          ? column.toggleSorting(false)
          : column.toggleSorting(true);
      }}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDownIcon className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUpIcon className="ml-2 h-4 w-4" />
      ) : (
        <CaretSortIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
