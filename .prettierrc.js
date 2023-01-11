/* @type {import('prettier').Options}*/
const config = {
  plugins: [
    require.resolve("@prettier/plugin-php"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  tabWidth: 2,
  useTabs: false,
};

module.exports = config;
