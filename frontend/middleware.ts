import type { NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import { signJWT } from "@/utils/json-web-token";

import { NEXT_AUTH_PAGES } from "@plan-prise/auth/config";
import type { NextRequestWithAuth } from "@plan-prise/auth/exports";
import { withAuth } from "@plan-prise/auth/exports";

const toLegacy = (path: string, destination?: string) =>
  process.env.BACKEND_URL + (destination ?? path);

const withAuthMiddleware = withAuth(
  async (request: NextRequestWithAuth) => {
    const requestHeaders = new Headers(request.headers);

    if (request.nextauth.token) {
      requestHeaders.append(
        "Authorization",
        await signJWT({ user_id: request.nextauth.token.user.id }),
      );
    }

    const legacyUrl =
      toLegacy(request.nextUrl.pathname) + request.nextUrl.search;

    return NextResponse.rewrite(legacyUrl, {
      request: { headers: requestHeaders },
    });
  },
  { pages: { signIn: NEXT_AUTH_PAGES.signIn } },
);

export const middleware = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) => {
  const legacyUrl = toLegacy(request.nextUrl.pathname) + request.nextUrl.search;

  if (
    request.nextUrl.pathname.startsWith("/ajax") ||
    request.nextUrl.pathname.startsWith("/calendrier")
  ) {
    return withAuthMiddleware(request, event);
  } else {
    return NextResponse.rewrite(legacyUrl);
  }
};

export const config = {
  matcher: [
    "/css/:css*",
    "/fonts/:font*",
    "/js/:js*",
    "/img/:img*",
    "/files/:file*",
    "/ajax/:file*",
    "/calendrier/:file*",
  ],
};
