import type { Config } from "tailwindcss";

import baseConfig from "@plan-prise/tailwind-config";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./node_modules/@plan-prise/ui/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;
