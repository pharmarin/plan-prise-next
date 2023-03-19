import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession as $getServerSession } from "next-auth";

import nextAuthOptions from "@/next-auth/options";

type GetServerSessionContext =
  | {
      req: GetServerSidePropsContext["req"];
      res: GetServerSidePropsContext["res"];
    }
  | { req: NextApiRequest; res: NextApiResponse };
export const getServerSession = (ctx?: GetServerSessionContext) => {
  return ctx
    ? $getServerSession(ctx.req, ctx.res, nextAuthOptions)
    : $getServerSession(nextAuthOptions);
};
