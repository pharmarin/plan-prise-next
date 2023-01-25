import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import Button from "components/forms/inputs/Button";
import React from "react";

const Pagination: React.FC<{
  data: {
    "current-page"?: number;
    from?: number;
    "last-page"?: number;
    "per-page"?: number;
    to?: number;
    total?: number;
  };
  setPage: (pageNumber: number) => void;
}> = ({ data, setPage }) => {
  const {
    "current-page": currentPage,
    from,
    "last-page": lastPage,
    to,
    total,
  } = data;

  const ICON_CLASSNAME = "h-3 w-3";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 justify-between sm:hidden">
        {(currentPage || 0) > 1 && (
          <Button
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            color="link"
            onClick={() => setPage((currentPage || 2) - 1)}
          >
            Précédent
          </Button>
        )}
        {(currentPage || 0) !== (lastPage || 0) && (
          <Button
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            color="link"
            onClick={() => setPage((currentPage || 1) + 1)}
          >
            Suivant
          </Button>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {from && to && total && (
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{from}</span> à{" "}
              <span className="font-medium">{to}</span> sur{" "}
              <span className="font-medium">{total}</span> resultats
            </p>
          </div>
        )}
        {currentPage && lastPage && (
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px shadow-sm"
              aria-label="Pagination"
            >
              <Button
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentPage === 1}
                onClick={() =>
                  currentPage > 1 ? setPage(currentPage - 1) : null
                }
              >
                <span className="sr-only">Précédent</span>
                <ChevronLeftIcon className={ICON_CLASSNAME} />
              </Button>
              <Button
                className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setPage(1)}
              >
                <ChevronDoubleLeftIcon className={ICON_CLASSNAME} />
              </Button>
              {[3, 2, 1].map((key) =>
                currentPage - key > 0 && currentPage - key < lastPage ? (
                  <Button
                    key={`end_${currentPage - key}`}
                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setPage(currentPage - key)}
                  >
                    {currentPage - key}
                  </Button>
                ) : undefined
              )}
              <select
                className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onChange={(e) => setPage(Number(e.target.value))}
                value={currentPage}
              >
                {[
                  ...Array(Math.floor((lastPage - 10) / 10) + 1)
                    .fill(0)
                    .map((_, idx) => 10 + idx * 10),
                  currentPage,
                ]
                  .sort((a, b) => a - b)
                  .map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
              </select>
              {[1, 2, 3].map((key) =>
                currentPage + key > 0 && currentPage + key <= lastPage ? (
                  <Button
                    key={`start_${currentPage + key}`}
                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setPage(currentPage + key)}
                  >
                    {currentPage + key}
                  </Button>
                ) : undefined
              )}
              <Button
                className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setPage(lastPage)}
              >
                <ChevronDoubleRightIcon className={ICON_CLASSNAME} />
              </Button>
              <Button
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentPage === lastPage}
                onClick={() =>
                  currentPage < lastPage ? setPage(currentPage + 1) : null
                }
              >
                <span className="sr-only">Suivant</span>
                <ChevronRightIcon className={ICON_CLASSNAME} />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
