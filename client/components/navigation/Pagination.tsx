import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import Button from "components/forms/inputs/Button";
import Select from "components/forms/inputs/Select";
import React from "react";

const Pagination: React.FC<{
  data: {
    currentPage?: number;
    from?: number;
    lastPage?: number;
    perPage?: number;
    to?: number;
    total?: number;
  };
  setPage: (pageNumber: number) => void;
}> = ({ data, setPage }) => {
  const { currentPage, from, lastPage, to, total } = data;

  const ICON_CLASSNAME = "h-4 w-4";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 justify-start space-x-1 sm:hidden">
        {(currentPage || 0) > 1 && (
          <Button
            color="white"
            onClick={() => setPage((currentPage || 2) - 1)}
            size="sm"
          >
            Précédent
          </Button>
        )}
        {(currentPage || 0) !== (lastPage || 0) && (
          <Button
            color="white"
            onClick={() => setPage((currentPage || 1) + 1)}
            size="sm"
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
            <nav className="flex space-x-1" aria-label="Pagination">
              <Button color="white" onClick={() => setPage(1)} size="sm">
                <ChevronDoubleLeftIcon className={ICON_CLASSNAME} />
              </Button>
              <Button
                color="white"
                disabled={currentPage === 1}
                onClick={() =>
                  currentPage > 1 ? setPage(currentPage - 1) : null
                }
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
                    onClick={() => setPage(currentPage - key)}
                    size="sm"
                  >
                    {currentPage - key}
                  </Button>
                ) : undefined
              )}
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPage(Number(e.target.value))
                }
                size="sm"
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
              </Select>
              {[1, 2, 3].map((key) =>
                currentPage + key > 0 && currentPage + key <= lastPage ? (
                  <Button
                    key={`start_${currentPage + key}`}
                    color="white"
                    onClick={() => setPage(currentPage + key)}
                    size="sm"
                  >
                    {currentPage + key}
                  </Button>
                ) : undefined
              )}
              <Button
                color="white"
                disabled={currentPage === lastPage}
                onClick={() =>
                  currentPage < lastPage ? setPage(currentPage + 1) : null
                }
                size="sm"
              >
                <span className="sr-only">Suivant</span>
                <ChevronRightIcon className={ICON_CLASSNAME} />
              </Button>
              <Button color="white" onClick={() => setPage(lastPage)} size="sm">
                <ChevronDoubleRightIcon className={ICON_CLASSNAME} />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
