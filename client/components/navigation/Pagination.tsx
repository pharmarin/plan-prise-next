import Button from "@/components/forms/inputs/Button";
import Select from "@/components/forms/inputs/Select";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { type CoreInstance, type PaginationInstance } from "@tanstack/react-table";
import React from "react";

const Pagination: React.FC<{
  getCanNextPage: PaginationInstance<any>["getCanNextPage"];
  getCanPreviousPage: PaginationInstance<any>["getCanPreviousPage"];
  getPageCount: PaginationInstance<any>["getPageCount"];
  getState: CoreInstance<any>["getState"];
  nextPage: PaginationInstance<any>["nextPage"];
  previousPage: PaginationInstance<any>["previousPage"];
  setPageIndex: PaginationInstance<any>["setPageIndex"];
  setPageSize: PaginationInstance<any>["setPageSize"];
}> = ({
  getCanNextPage,
  getCanPreviousPage,
  getPageCount,
  getState,
  nextPage,
  previousPage,
  setPageIndex,
  setPageSize,
}) => {
  const ICON_CLASSNAME = "h-4 w-4";

  const currentPage = getState().pagination.pageIndex + 1;
  const lastPage = getPageCount();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 justify-start space-x-1 sm:hidden">
        <Button
          color="white"
          disabled={!getCanPreviousPage()}
          onClick={previousPage}
          size="sm"
        >
          Précédent
        </Button>
        <Button
          color="white"
          disabled={!getCanNextPage()}
          onClick={nextPage}
          size="sm"
        >
          Suivant
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Affichage de la page{" "}
            <span className="font-medium">{currentPage}</span> sur{" "}
            <span className="font-medium">{lastPage}</span>
          </p>
        </div>
        <nav className="flex space-x-1" aria-label="Pagination">
          <Button
            color="white"
            disabled={!getCanPreviousPage()}
            onClick={() => setPageIndex(1)}
            size="sm"
          >
            <ChevronDoubleLeftIcon className={ICON_CLASSNAME} />
          </Button>
          <Button
            color="white"
            disabled={!getCanPreviousPage()}
            onClick={previousPage}
            size="sm"
          >
            <span className="sr-only">Précédent</span>
            <ChevronLeftIcon className={ICON_CLASSNAME} />
          </Button>
          {[3, 2, 1].map((key) =>
            currentPage - key > 0 && currentPage - key < lastPage ? (
              <Button
                key={`end_${currentPage - key}`}
                color="white"
                onClick={() =>
                  setPageIndex(getState().pagination.pageIndex - key)
                }
                size="sm"
              >
                {currentPage - key}
              </Button>
            ) : undefined
          )}
          <Select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPageIndex(Number(e.target.value))
            }
            size="sm"
            value={currentPage - 1}
          >
            {[
              ...new Set([
                ...(lastPage > 10
                  ? Array(Math.floor(lastPage / 10))
                      .fill(0)
                      .map((_, idx) => 10 + idx * 10)
                  : Array(lastPage)
                      .fill(0)
                      .map((_, idx) => idx + 1)),
                currentPage,
              ]),
            ]
              .sort((a, b) => a - b)
              .map((page) => (
                <option key={page} value={page - 1}>
                  {page}
                </option>
              ))}
          </Select>
          {[1, 2, 3].map((key) =>
            currentPage + key > 0 && currentPage + key <= lastPage ? (
              <Button
                key={`start_${currentPage + key}`}
                color="white"
                onClick={() =>
                  setPageIndex(getState().pagination.pageIndex + key)
                }
                size="sm"
              >
                {currentPage + key}
              </Button>
            ) : undefined
          )}
          <Button
            color="white"
            disabled={!getCanNextPage()}
            onClick={nextPage}
            size="sm"
          >
            <span className="sr-only">Suivant</span>
            <ChevronRightIcon className={ICON_CLASSNAME} />
          </Button>
          <Button
            color="white"
            disabled={!getCanNextPage()}
            onClick={() => setPageIndex(lastPage)}
            size="sm"
          >
            <ChevronDoubleRightIcon className={ICON_CLASSNAME} />
          </Button>
          <Select
            value={getState().pagination.pageSize}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} par page
              </option>
            ))}
          </Select>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
