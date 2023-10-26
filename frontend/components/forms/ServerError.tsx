import { type AppRouter } from "@/trpc/routers/app";
import { DEFAULT_ERROR } from "@/utils/errors";
import type { TRPCClientErrorLike } from "@trpc/client";

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
