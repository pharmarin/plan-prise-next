require("dotenv").config({
  path: "./../.env",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
