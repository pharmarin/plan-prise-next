/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [["next-superjson-plugin", {}]],
    typedRoutes: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    config.externals = ["nock", "mock-aws-s3", "aws-sdk"];

    return config;
  },
};

export default nextConfig;
