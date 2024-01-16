import type { JWTPayload } from "jose";
import { jwtVerify, SignJWT } from "jose";

import { env } from "../env.mjs";

const secret = new TextEncoder().encode(env.CROSS_SITE_SECRET ?? "");

export const signJWT = async (payload: JWTPayload, expiration = "2h") =>
  await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secret);

export const verifyJWT = async (jwt: string) => await jwtVerify(jwt, secret);
