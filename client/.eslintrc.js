/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["next", "prettier"],
  ignorePatterns: [
    "**/*.config.js",
    "**/*.setup.js",
    "**/*.config.cjs",
    "**/*rc.js",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["testing-library"],
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};

module.exports = config;
