/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["next", "prettier", "plugin:@typescript-eslint/recommended"],
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
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
  },
};

module.exports = config;
