/** @type {import('jest').Config} */
const jestConfig = {
  clearMocks: true,
  preset: "ts-jest",
  setupFiles: ["@plan-prise/jest-config"],
  // Use mock in other packages
  // setupFilesAfterEnv: ["<rootDir>/mock-client.ts"],
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transform: {},
};

export default jestConfig;
