/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  },
  theme: {
    extend: {},
  },
  plugins: [import("@tailwindcss/forms")],
};
