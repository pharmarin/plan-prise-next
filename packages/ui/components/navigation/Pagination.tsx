import React from "react";
import type { CoreInstance, PaginationInstance } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "../../shadcn/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/ui/select";

const Pagination: React.FC<{
  getCanNextPage: PaginationInstance<never>["getCanNextPage"];
  getCanPreviousPage: PaginationInstance<never>["getCanPreviousPage"];
  getPageCount: PaginationInstance<never>["getPageCount"];
  getState: CoreInstance<never>["getState"];
  nextPage: PaginationInstance<never>["nextPage"];
  previousPage: PaginationInstance<never>["previousPage"];
  setPageIndex: PaginationInstance<never>["setPageIndex"];
  setPageSize: PaginationInstance<never>["setPageSize"];
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
          disabled={!getCanPreviousPage()}
          onClick={previousPage}
          size="sm"
          variant="outline"
        >
          Précédent
        </Button>
        <Button
          disabled={!getCanNextPage()}
          onClick={nextPage}
          size="sm"
          variant="outline"
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
            disabled={!getCanPreviousPage()}
            onClick={() => setPageIndex(1)}
            size="sm"
            variant="outline"
          >
            <ChevronsLeftIcon className={ICON_CLASSNAME} />
          </Button>
          <Button
            disabled={!getCanPreviousPage()}
            onClick={previousPage}
            size="sm"
            variant="outline"
          >
            <span className="sr-only">Précédent</span>
            <ChevronLeftIcon className={ICON_CLASSNAME} />
          </Button>
          {[3, 2, 1].map((key) =>
            currentPage - key > 0 && currentPage - key < lastPage ? (
              <Button
                key={`end_${currentPage - key}`}
                onClick={() =>
                  setPageIndex(getState().pagination.pageIndex - key)
                }
                size="sm"
                variant="outline"
              >
                {currentPage - key}
              </Button>
            ) : undefined,
          )}
          <Select
            onValueChange={(value) => setPageIndex(Number(value))}
            value={String(currentPage - 1)}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue placeholder={currentPage - 1} />
            </SelectTrigger>
            <SelectContent>
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
                  <SelectItem key={page} value={String(page - 1)}>
                    {page}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {[1, 2, 3].map((key) =>
            currentPage + key > 0 && currentPage + key <= lastPage ? (
              <Button
                key={`start_${currentPage + key}`}
                onClick={() =>
                  setPageIndex(getState().pagination.pageIndex + key)
                }
                size="sm"
                variant="outline"
              >
                {currentPage + key}
              </Button>
            ) : undefined,
          )}
          <Button
            disabled={!getCanNextPage()}
            onClick={nextPage}
            size="sm"
            variant="outline"
          >
            <span className="sr-only">Suivant</span>
            <ChevronRightIcon className={ICON_CLASSNAME} />
          </Button>
          <Button
            disabled={!getCanNextPage()}
            onClick={() => setPageIndex(lastPage)}
            size="sm"
            variant="outline"
          >
            <ChevronsRightIcon className={ICON_CLASSNAME} />
          </Button>
          <Select
            value={String(getState().pagination.pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Nombre par page" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize} par page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
