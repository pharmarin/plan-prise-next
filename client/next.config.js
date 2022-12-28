require("dotenv").config({
  path: "./../.env",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.APP_URL,
  },
  experimental: { appDir: true },
  images: {
    remotePatterns: [
      {
        hostname: "eu.ui-avatars.com",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
