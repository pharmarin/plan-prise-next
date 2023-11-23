import type { NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

import { signJWT } from "@plan-prise/api/utils/json-web-token";
import { NEXT_AUTH_PAGES } from "@plan-prise/auth/config";

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
  const pathname = request.nextUrl.pathname;
  const legacyUrl = toLegacy(pathname) + request.nextUrl.search;

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  if (pathname.startsWith("/ajax") || pathname.startsWith("/calendrier")) {
    return withAuthMiddleware(request, event);
  } else if (
    pathname.startsWith("/css") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/js") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/files")
  ) {
    return NextResponse.rewrite(legacyUrl);
  }
};
