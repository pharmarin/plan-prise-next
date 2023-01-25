import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import TextInput from "components/forms/inputs/TextInput";
import Spinner from "components/icons/Spinner";
import Pagination from "components/navigation/Pagination";
import Dropdown from "components/overlays/Dropdown";
import Table from "components/table/Table";
import TableBody from "components/table/TableBody";
import TableCell from "components/table/TableCell";
import TableFooter from "components/table/TableFooter";
import TableHead from "components/table/TableHead";
import TableHeadCell from "components/table/TableHeadCell";
import TableRow from "components/table/TableRow";
import BaseModel from "lib/redux/models/BaseModel";
import { debounce } from "lodash";
import React, { useState } from "react";
import { useAsync } from "react-async-hook";

const AsyncTable = <
  T extends typeof BaseModel,
  C extends { [id: string]: string }
>({
  columns,
  extractData,
  filters = {},
  include,
  linkTo,
  searchKey,
  sortBy,
  type,
  ...props
}: {
  columns: C;
  extractData: (
    filter: string | number,
    columnId: keyof C,
    data: any,
    forceReload?: any
  ) => string | React.ReactElement;
  filters?: {
    [key: string]: {
      label: string;
      filter?: { field: string; value: string };
    };
  };
  include?: string[];
  /**
   * URL of the link wrapping table cell
   * Must contain "ID" which will be replaced by the id of the row element
   */
  linkTo?: string;
  sortBy?: string;
  searchKey?: string;
  type: T;
} & React.ComponentPropsWithoutRef<"div">) => {
  const [filter, setFilter] = useState<keyof typeof filters>(
    Object.keys(filters)[0]
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const setSearchDebounced = debounce((query: string) => {
    setSearch(query);
  }, 1000);

  const {
    error,
    loading,
    result,
    execute: reload,
  } = useAsync(
    async (page: number = 0, filter: keyof typeof filters, search: string) =>
      await type.getMany({
        query: {
          custom: [{ key: "page[number]", value: String(page) }],
          filter: {
            ...(searchKey && search && search.length > 0
              ? {
                  [searchKey]: search,
                }
              : {}),
            ...(filters[filter]?.filter !== undefined
              ? {
                  [filters[filter].filter!.field]:
                    filters[filter].filter!.value,
                }
              : {}),
          },
          include,
          sort: sortBy,
        },
      }),
    [page, filter, search]
  );

  const columnsLength = Object.keys(columns).length;

  return (
    <div {...props} className="overflow-y-auto">
      <div className="mb-4 flex items-center justify-between">
        {searchKey && (
          <div className="flex-1 pr-4">
            <div className="relative md:w-1/3">
              <TextInput
                className="border-0 py-2 pl-10 pr-4 shadow-md"
                name="search"
                type="search"
                placeholder="Rechercher..."
                onChange={(event) => {
                  event.currentTarget.value.length > 0
                    ? setSearchDebounced(event.currentTarget.value)
                    : setSearch("");
                }}
              />
              <div className="absolute left-0 top-0 inline-flex items-center p-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {Object.keys(filters).length > 0 && (
          <Dropdown
            buttonContent={
              <span className="flex align-middle">
                {filters[filter]?.label}
                <ChevronDownIcon className="ml-1 mt-1 h-4 w-4" />
              </span>
            }
            buttonProps={{
              className:
                "py-2 px-3 bg-white shadow-md rounded-lg text-gray-600 font-medium",
            }}
            items={Object.keys(filters).map((key) => ({
              label: filters[key].label,
              action: () => setFilter(key),
            }))}
          />
        )}
      </div>

      <Table className="text-center" stripped>
        <TableHead>
          <TableRow>
            {Object.entries(columns).map(([id, label]) => (
              <TableHeadCell key={id}>{label}</TableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(() => {
            if (loading) {
              return (
                <TableRow>
                  <TableCell colSpan={columnsLength}>
                    <div className="flex justify-center align-middle text-gray-600">
                      <Spinner />
                      <span className="ml-4">Chargement en cours...</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (error) {
              console.error(error);
              return (
                <TableRow>
                  <TableCell colSpan={columnsLength}>
                    <div className="text-center text-red-600">
                      Une erreur est survenue pendant le chargement
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (((result?.data as InstanceType<T>[]) || []).length === 0) {
              return (
                <TableRow>
                  <TableCell colSpan={columnsLength}>
                    <div className="flex justify-center align-middle text-gray-600">
                      La recherche n&apos;a rien retourné
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            if (((result?.data as InstanceType<T>[]) || []).length > 0) {
              return ((result?.data as InstanceType<T>[]) || []).map((row) => (
                <TableRow key={row.id || ""} hover={linkTo !== undefined}>
                  {Object.keys(columns).map((id) => (
                    <TableCell
                      key={id}
                      link={
                        linkTo && linkTo.replace("ID", String(row.id) || "")
                      }
                    >
                      {extractData(filter, id, row, () =>
                        reload(page, filter, search)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ));
            }
          })()}
        </TableBody>
        {result?.data && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columnsLength}>
                <Pagination
                  setPage={(pageNumber) => setPage(pageNumber)}
                  data={(result.meta as any)?.page || {}}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
};

export default AsyncTable;
