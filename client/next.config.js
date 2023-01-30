const dotenv = require("dotenv").config({
  path: "./../.env",
});
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(dotenv);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  reactStrictMode: true,
};

module.exports = nextConfig;
