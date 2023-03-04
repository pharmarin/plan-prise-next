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
    // @ts-ignore
    require("@prettier/plugin-php"),
    // @ts-ignore
    require("prettier-plugin-tailwindcss"),
  ],
  tabWidth: 2,
  tailwindConfig: "./packages/config/tailwindcss",
  useTabs: false,
};

module.exports = config;
