import sendMail from "@/utils/mail";
import { expect, test } from "@playwright/test";

test.describe("registration", () => {
  test("should send mail without error", () => {
    expect(
      sendMail(
        { email: "marin@plandeprise.fr", name: "Marin ROUX" },
        "Bienvenue sur plandeprise.fr !",
        "pq3enl6xr8rl2vwr"
      )
    ).resolves.not.toThrow();
  });
});

export {};
