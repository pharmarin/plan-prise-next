/** @type {import('jest').Config} */
const jestConfig = {
  setupFiles: ["@plan-prise/jest-config"],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default jestConfig;
