import { NEXT_AUTH_PAGES } from "@/next-auth/config";
import { signJWT } from "@/utils/json-web-token";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { type Rewrite } from "next/dist/lib/load-custom-routes";
import { NextResponse } from "next/server";

const legacyAssets = ["css", "js", "img", "fonts"];

const toLegacy = (path: string, destination?: string): Rewrite => ({
  source: path,
  destination: process.env.APP_URL + (destination || path),
});

const _legacyPaths: Rewrite[] = [
  ...legacyAssets.map((asset) => toLegacy(`/${asset}/:asset*`)),
  toLegacy("/plan"),
];

export const middleware = withAuth(
  async (request: NextRequestWithAuth) => {
    if (config.matcher.includes(request.nextUrl.pathname)) {
      const requestHeaders = new Headers(request.headers);

      if (request.nextauth.token) {
        requestHeaders.append(
          "Authorization",
          await signJWT({ user_id: request.nextauth.token.user.id })
        );
      }

      return NextResponse.rewrite(
        toLegacy(request.nextUrl.pathname).destination,
        {
          request: { headers: requestHeaders },
        }
      );
    } else {
      NextResponse.next();
    }
  },
  { pages: { signIn: NEXT_AUTH_PAGES.signIn } }
);

export const config = {
  matcher: ["/plan"],
};
