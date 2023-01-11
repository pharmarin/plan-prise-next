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
    require.resolve("@prettier/plugin-php"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  tabWidth: 2,
  useTabs: false,
};

module.exports = config;
