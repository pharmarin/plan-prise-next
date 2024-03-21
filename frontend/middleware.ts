import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GUEST_ROUTES, routes } from "@/app/routes-schema";
import { env } from "@/env.mjs";
import { getToken } from "next-auth/jwt";

const redirectTo = (request: NextRequest, pathAndSearch: string) => {
  const url = request.nextUrl.clone();
  const [path, search] = pathAndSearch.split("?");
  url.pathname = path ?? "";
  url.search = search ?? "";
  return NextResponse.redirect(url);
};

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });

  if (env.MAINTENANCE_MODE) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
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
