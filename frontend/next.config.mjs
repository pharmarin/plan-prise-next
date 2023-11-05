import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  reactStrictMode: true,
  transpilePackages: ["@plan-prise/api-pharmaciens", "@plan-prise/db-prisma"],
  webpack: (config, { isServer }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    if (isServer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
