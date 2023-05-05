import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.CROSS_SITE_SECRET || "");

export const signJWT = async (payload: JWTPayload, expiration = "2h") =>
  await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secret);

export const verifyJWT = async (jwt: string) => await jwtVerify(jwt, secret);
