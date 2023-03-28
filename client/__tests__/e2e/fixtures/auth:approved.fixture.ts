import { test as auth } from "@/__tests__/e2e/fixtures/auth.fixture";

// eslint-disable-next-line @typescript-eslint/ban-types
type ApprovedFixtures = {};

const test = auth.extend<ApprovedFixtures>({});

export default test;
