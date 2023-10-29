import type { Config } from "tailwindcss";

import baseConfig from "@plan-prise/tailwind-config";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;
