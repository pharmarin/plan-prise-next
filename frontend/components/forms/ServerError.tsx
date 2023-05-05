import FormInfo from "@/components/forms/FormInfo";
import { type AppRouter } from "@/trpc/routers/app";
import { DEFAULT_ERROR } from "@/utils/errors";
import type { TRPCClientErrorLike } from "@trpc/client";

const ServerError: React.FC<{
  error: TRPCClientErrorLike<AppRouter["users"]["passwordVerify"]>;
}> = ({ error }) => {
  if (error?.data && "type" in error.data && error.data.type === "PP_Error") {
    return (
      <FormInfo color="red">
        {error.data.message}
        {error.data?.infos && `: ${error.data.infos}`}
      </FormInfo>
    );
  }
  return <FormInfo color="red">{DEFAULT_ERROR}</FormInfo>;
};
export default ServerError;
