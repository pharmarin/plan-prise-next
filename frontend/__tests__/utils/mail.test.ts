import { expect, test } from "@playwright/test";

import sendMail from "@plan-prise/api/utils/mail";

test.describe("registration", () => {
  test("should send mail without error", () => {
    expect(
      sendMail(
        { email: "marin@plandeprise.fr", name: "Marin ROUX" },
        "Bienvenue sur plandeprise.fr !",
        "pq3enl6xr8rl2vwr",
      ),
    ).resolves.not.toThrow();
  });
});

export {};
