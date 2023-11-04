import { test as auth } from "@/__tests__/e2e/fixtures/auth.fixture";

interface ApprovedFixtures {}

const test = auth.extend<ApprovedFixtures>({});

export default test;
