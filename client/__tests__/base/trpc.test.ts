import { trpc } from "@/trpc/client";
import { expect, test } from "@playwright/test";

test.describe("tRPC tests", () => {
  test('should succeed guest query', () => {
    const guestQuery = trpc.tests.guestQuery.useQuery()

    expect(guestQuery.data).toBe('success')
  })

  test('should fail auth query', () => {
    const authQuery = trpc.tests.authQuery.useQuery()

    expect(authQuery.error).toBe(false);
  })
})