"use client";

import { useCallback, useState } from "react";
import type { SafeAction } from "next-safe-action";
import type { Schema, z } from "zod";

export type UseAsyncState<T> = {
  data: T | undefined;
  error: boolean;
  isSuccess: boolean;
  isLoading: boolean;
};

/**
 * Returns a current execution state of an async function.
 * Use it to orchestrate async actions in UI.
 *
 * @see https://react-hooks-library.vercel.app/core/useAsyncCallback
 */
export function useAsyncCallback<
  S extends Schema,
  Args extends z.input<S>,
  Data,
>(
  callback: SafeAction<S, Data>,
): [UseAsyncState<Data>, (args: Args) => Promise<Data>] {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<Data>();

  const _callback = useCallback(
    async (args: Args) => {
      try {
        setIsLoading(true);

        const results = await callback(args).then((response) => {
          if (response.serverError) {
            setError(true);
            throw new Error(
              response.serverError ?? "Server action failed without error",
            );
          }

          if (response.validationErrors) {
            setError(true);
            throw new Error("Error validating action");
          }

          return response.data as Data;
        });

        setData(results);
        setIsSuccess(true);

        return results;
      } catch (e) {
        setError(true);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callback],
  );

  return [{ data, error, isLoading, isSuccess }, _callback];
}
