BigInt.prototype.toJSON = function () {
  return this.toString();
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  reactStrictMode: true,
};

module.exports = nextConfig;
