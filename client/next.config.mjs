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
  transpilePackages: ["@plan-prise/prisma", "@plan-prise/trpc"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

export default nextConfig;
