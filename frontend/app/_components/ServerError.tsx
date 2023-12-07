import type { TRPCClientErrorLike } from "@trpc/client";

import type { AppRouter } from "@plan-prise/api";
import { DEFAULT_ERROR } from "@plan-prise/errors";

const ServerError: React.FC<{
  error: TRPCClientErrorLike<AppRouter["users"]["passwordVerify"]>;
}> = ({ error }) => {
  if (error?.data && "type" in error.data && error.data.type === "PP_Error") {
    return (
      <p className="mt-1 text-xs text-red-500">
        {error.data.message}
        {error.data?.infos && `: ${error.data.infos}`}
      </p>
    );
  }
  return <p className="mt-1 text-xs text-red-500">{DEFAULT_ERROR}</p>;
};
export default ServerError;
