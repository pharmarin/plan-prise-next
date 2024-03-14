import { concat } from "lodash-es";

export const mergeArray = <T>(...args: (T | false | undefined)[]) =>
  concat(...args).filter((value): value is T => Boolean(value));
