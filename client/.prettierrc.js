/* @type {import('prettier').Options}*/
const config = {
  overrides: [
    {
      files: ["*.php"],
      options: {
        parser: "php", // vscode will not be able to infer the parser for some reason so we need to explicitly specify it.
      },
    },
  ],
  plugins: [
    require("@prettier/plugin-php"),
    require("prettier-plugin-tailwindcss"),
  ],
  tabWidth: 2,
  tailwindConfig: "./tailwind.config.js",
  useTabs: false,
};

module.exports = config;
