/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["@plan-prise/eslint-config"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./frontend/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  settings: {
    next: {
      rootDir: ["frontend"],
    },
  },
};

module.exports = config;
