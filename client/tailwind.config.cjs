/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  // @ts-ignore
  presets: [require("@plan-prise/tailwind-config")],
};

module.exports = config;
