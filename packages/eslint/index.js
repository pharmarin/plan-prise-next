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
    "@typescript-eslint/return-await": "error",
    "no-html-link-for-pages": "off",
    // Required by @typescript-eslint/return-await
    "no-return-await": "off",
  },
};

module.exports = config;
