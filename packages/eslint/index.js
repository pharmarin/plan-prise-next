/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["next", "prettier", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: [
    "**/*.config.js",
    "**/*.setup.js",
    "**/*.config.cjs",
    "**/*rc.js",
  ],
  reportUnusedDisableDirectives: true,
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
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "no-html-link-for-pages": "off",
  },
};

module.exports = config;
