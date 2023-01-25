require("dotenv").config({
  path: "./../.env",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  reactStrictMode: true,
};

module.exports = nextConfig;
