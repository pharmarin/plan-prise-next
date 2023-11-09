/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  reactStrictMode: true,
  transpilePackages: [
    "@plan-prise/api-pharmaciens",
    "@plan-prise/auth",
    "@plan-prise/db-prisma",
    "@plan-prise/errors",
  ],
  webpack: (config) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
