require("dotenv").config({
  path: "./../.env",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.APP_URL,
  },
  experimental: { appDir: true },
  reactStrictMode: true,
  /* redirects() {
    return ["/sanctum/csrf-cookie", "/login", "/api/:path*"].map((path) => ({
      source: path,
      destination: `http://plan-prise.test${path}`,
      permanent: false,
    }));
  }, */
};

module.exports = nextConfig;
