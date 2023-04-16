/* @type {import('prettier').Options}*/
const config = {
  plugins: [require("prettier-plugin-tailwindcss")],
  tabWidth: 2,
  tailwindConfig: "./tailwind.config.js",
  useTabs: false,
};

module.exports = config;
