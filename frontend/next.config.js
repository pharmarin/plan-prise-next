/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [["next-superjson-plugin", {}]],
    typedRoutes: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
