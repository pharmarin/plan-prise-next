import { NEXT_AUTH_PAGES } from "@/next-auth/config";
import { signJWT } from "@/utils/json-web-token";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const toLegacy = (path: string, destination?: string) =>
  process.env.BACKEND_URL + (destination || path);

export const middleware = withAuth(
  async (request: NextRequestWithAuth) => {
    const requestHeaders = new Headers(request.headers);

    if (request.nextauth.token) {
      requestHeaders.append(
        "Authorization",
        await signJWT({ user_id: request.nextauth.token.user.id })
      );
    }

    const legacyUrl =
      toLegacy(request.nextUrl.pathname) + request.nextUrl.search;

    return NextResponse.rewrite(legacyUrl, {
      request: { headers: requestHeaders },
    });
  },
  { pages: { signIn: NEXT_AUTH_PAGES.signIn } }
);

export const config = {
  matcher: [
    "/css/:css*",
    "/fonts/:font*",
    "/js/:js*",
    "/img/:img*",
    "/ajax/:file*",
    "/plan/:file*",
    "/calendrier/:file*",
  ],
};
