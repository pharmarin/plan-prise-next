import { NEXT_AUTH_PAGES } from "@/next-auth/config";
import { signJWT } from "@/utils/json-web-token";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent } from "next/server";

const toLegacy = (path: string, destination?: string) =>
  process.env.BACKEND_URL + (destination || path);

  const withAuthMiddleware = withAuth(
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

export const middleware = (request: NextRequestWithAuth, event: NextFetchEvent) => {
  const legacyUrl =
    toLegacy(request.nextUrl.pathname) + request.nextUrl.search;
  
  if (request.nextUrl.pathname.startsWith("/ajax") || request.nextUrl.pathname.startsWith("/plan") || request.nextUrl.pathname.startsWith("/calendrier")) {
    return withAuthMiddleware(request, event)
  } else {
    return NextResponse.rewrite(legacyUrl);
  }
}

/* withAuth(
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
); */

export const config = {
  matcher: [
    "/css/:css*",
    "/fonts/:font*",
    "/js/:js*",
    "/img/:img*",
    "/files/:file*",
    "/ajax/:file*",
    "/plan/:file*",
    "/calendrier/:file*",
  ],
};
