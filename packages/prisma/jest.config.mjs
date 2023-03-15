/** @type {import('jest').Config} */
const jestConfig = {
  clearMocks: true,
  preset: "ts-jest",
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  // Use mock in other packages
  // setupFilesAfterEnv: ["<rootDir>/mock-client.ts"],
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transform: {},
};

export default jestConfig;
