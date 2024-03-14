import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GUEST_ROUTES, routes } from "@/app/routes-schema";
import { env } from "@/env.mjs";
import { getToken } from "next-auth/jwt";

import { signJWT } from "@plan-prise/api/utils/json-web-token";

const toLegacy = (path: string, destination?: string) =>
  env.BACKEND_URL + (destination ?? path);

const redirectTo = async (request: NextRequest, pathAndSearch: string) => {
  const url = request.nextUrl.clone();
  const [path, search] = pathAndSearch.split("?");
  url.pathname = path ?? "";
  url.search = search ?? "";

  const token = await getToken({ req: request });

  return JSON.stringify(token);
};

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });

  if (env.MAINTENANCE_MODE) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  // LEGACY ROUTES

  if (pathname.startsWith("/ajax") || pathname.startsWith("/calendrier")) {
    const legacyUrl = toLegacy(pathname) + request.nextUrl.search;
    const requestHeaders = new Headers(request.headers);

    if (token) {
      requestHeaders.append(
        "Authorization",
        await signJWT({ user_id: token.user.id }),
      );
    }

    return NextResponse.rewrite(legacyUrl, {
      request: { headers: requestHeaders },
    });
  }

  if (
    pathname.startsWith("/css") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/js") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/files")
  ) {
    const legacyUrl = toLegacy(pathname) + request.nextUrl.search;

    return NextResponse.rewrite(legacyUrl);
  }

  // GUEST ROUTES

  if (
    Object.values(GUEST_ROUTES).find((route) =>
      pathname.startsWith(route as string),
    )
  ) {
    return token?.user.id
      ? redirectTo(request, routes.home())
      : NextResponse.next();
  }

  // ADMIN ROUTES

  if (pathname.startsWith("/admin")) {
    return token?.user.admin
      ? NextResponse.next()
      : redirectTo(request, routes.home());
  }

  // AUTH ROUTES

  return token?.user.id
    ? NextResponse.next()
    : redirectTo(
        request,
        routes.login(
          (pathname !== routes.home() && { search: { redirect: pathname } }) ||
            undefined,
        ),
      );
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
