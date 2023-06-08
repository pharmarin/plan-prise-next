export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // browser should use relative path
    return "";
  }

  if (process.env.NODE_ENV === "production" && process.env.PRODUCTION_URL) {
    return process.env.PRODUCTION_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const getUrl = (path: `/${string}`) => getBaseUrl() + path;

export default getUrl;
