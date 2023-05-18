/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [["next-superjson-plugin", {}]],
    typedRoutes: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@plan-prise/api-pharmaciens"],
};

module.exports = nextConfig;
