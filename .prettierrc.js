/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {{ tailwindConfig: string }} TailwindConfig */

/** @type {PrettierConfig | TailwindConfig} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 2,
  tailwindConfig: "./frontend/tailwind.config.js",
  useTabs: false,
};

module.exports = config;
