"use client";

import { useCallback, useState } from "react";
import { transformResponse } from "@/app/_safe-actions/safe-actions";
import type { SafeAction } from "next-safe-action";
import type { Schema, z } from "zod";

export type UseAsyncState<T> = {
  data: T | undefined;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  reset: () => void;
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
): [UseAsyncState<Data>, (args: Args) => Promise<Data | undefined>] {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<Data>();

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setData(undefined);
  };

  const _callback = useCallback(
    async (args: Args) => {
      try {
        setIsLoading(true);

        const results = await callback(args).then(transformResponse);

        setData(results);
        setIsSuccess(true);

        return results;
      } catch (e) {
        setIsError(true);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callback],
  );

  return [{ data, isError, isLoading, isSuccess, reset }, _callback];
}
