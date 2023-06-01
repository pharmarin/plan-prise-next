export const getBaseUrl = () => {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.FRONTEND_URL)
    // reference for render.com
    return `${process.env.FRONTEND_URL}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export function getTRPCUrl() {
  return getBaseUrl() + "/api/v1";
}
