import { test } from "@/__tests__/fixtures/auth.fixture";
import { fakeUserBase } from "@/__tests__/helpers/user";
import { expect } from "@playwright/test";
import { startCase, toUpper } from "lodash";

import prisma from "@plan-prise/db-prisma";
import errors from "@plan-prise/errors/errors.json";

import getUrl from "../../packages/api/src/utils/url";
import { checkPassword } from "../../packages/auth/src/lib/password-utils";

test.describe("auth", () => {
  test("should redirect unauthorized user to the login page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(getUrl("/login"));
  });

  test("should display an error if the user is not registered", async ({
    loginPage,
  }) => {
    await loginPage.populateForm("fake.mail@mail.com", "fake_password");
    await loginPage.submitForm();

    await expect(
      loginPage.page.getByText(errors.USER_LOGIN_ERROR),
    ).toBeVisible();
  });

  test("should display an error if the user is not approved", async ({
    loginPage,
    fakeUserNotApproved,
  }) => {
    await loginPage.populateForm(
      fakeUserNotApproved.email,
      fakeUserNotApproved.password,
    );
    await loginPage.submitForm();

    await expect(
      loginPage.page.getByText(errors.USER_NOT_APPROVED.message),
    ).toBeVisible();
  });

  test("should log user in if user is registered", async ({
    loginPage,
    fakeUserApproved,
    page,
  }) => {
    await loginPage.populateForm(
      fakeUserApproved.email,
      fakeUserApproved.password,
    );
    await loginPage.submitForm();

    await expect(page).toHaveURL(getUrl("/"));

    await expect(page.getByTestId("title")).toHaveText("Bienvenue");
  });

  test("should register user", async ({ registerPage, page }) => {
    const fakeUser = fakeUserBase();

    await registerPage.populateForm(fakeUser);
    await registerPage.submitForm();

    const registeredUser = await prisma.user.findFirst({
      where: {
        email: fakeUser.email,
      },
    });

    expect(registeredUser?.email).toBe(fakeUser.email);
    expect(checkPassword(fakeUser.password, registeredUser?.password ?? ""));
    expect(registeredUser?.firstName).toBe(
      startCase((fakeUser.firstName ?? "").toLowerCase()),
    );
    expect(registeredUser?.lastName).toBe(toUpper(fakeUser.lastName ?? ""));
    expect(registeredUser?.displayName).toBe(
      startCase((fakeUser.displayName ?? "").toLowerCase()),
    );
    expect(registeredUser?.admin).toBe(false);
    expect(registeredUser?.student).toBe(false);
    expect(registeredUser?.rpps).toBe(fakeUser.rpps);
    expect(registeredUser?.approvedAt).toBe(null);

    await expect(page.getByTestId("form-success-title")).toHaveText(
      "Demande d'inscription terminée",
    );

    await prisma.user.delete({ where: { id: registeredUser?.id } });
  });

  test("should register student", async ({ registerPage, page }) => {
    const fakeUser = { ...fakeUserBase(), student: true };

    await registerPage.populateForm(fakeUser);
    await registerPage.submitForm();

    const registeredUser = await prisma.user.findFirst({
      where: {
        email: fakeUser.email,
      },
    });

    expect(registeredUser?.email).toBe(fakeUser.email);
    expect(checkPassword(fakeUser.password, registeredUser?.password ?? ""));
    expect(registeredUser?.firstName).toBe(
      startCase((fakeUser.firstName ?? "").toLowerCase()),
    );
    expect(registeredUser?.lastName).toBe(toUpper(fakeUser.lastName ?? ""));
    expect(registeredUser?.displayName).toBe(
      startCase((fakeUser.displayName ?? "").toLowerCase()),
    );
    expect(registeredUser?.admin).toBe(false);
    expect(registeredUser?.student).toBe(true);
    expect(registeredUser?.certificate).toBe(
      "data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9MZW5ndGggNiAwIFIvRmlsdGVyIC9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nE2OsU7EMAyG9zyFx2Soz06cuF5PwMAEp2wnpopjKqjieH+SUqrag63/8297AUKOQD3/m2l2BB9ucSOmHqt47KcZztWdLgrNUW+O0MyEV8aghCNoIRSos7v6h8CYNVPyX2EgjCam4qeQsJWfgzSHIaIUysW//9HPA713yiXn0UOXWTRb8i9hkPYas26HRKJ/ChmL5mj7qFo8btj2f4eBMUYz3WFqlrf67B6re235C7VpOnVlbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKMTgwCmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Sb3RhdGUgMC9QYXJlbnQgMyAwIFIKL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERiAvVGV4dF0KL0ZvbnQgOCAwIFIKPj4KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbCjQgMCBSCl0gL0NvdW50IDEKPj4KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMyAwIFIKL01ldGFkYXRhIDkgMCBSCj4+CmVuZG9iago4IDAgb2JqCjw8L1I3CjcgMCBSPj4KZW5kb2JqCjcgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtUm9tYW4vVHlwZS9Gb250Ci9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjkgMCBvYmoKPDwvVHlwZS9NZXRhZGF0YQovU3VidHlwZS9YTUwvTGVuZ3RoIDE1NDk+PnN0cmVhbQo8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pgo8P2Fkb2JlLXhhcC1maWx0ZXJzIGVzYz0iQ1JMRiI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9J2Fkb2JlOm5zOm1ldGEvJyB4OnhtcHRrPSdYTVAgdG9vbGtpdCAyLjkuMS0xMywgZnJhbWV3b3JrIDEuNic+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIycgeG1sbnM6aVg9J2h0dHA6Ly9ucy5hZG9iZS5jb20vaVgvMS4wLyc+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSd1dWlkOjgxZDY5ZmI5LThiYzctMTFlNC0wMDAwLTY2YjFkZDE4MTEwYycgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJz48cGRmOlByb2R1Y2VyPkdQTCBHaG9zdHNjcmlwdCA5LjA2PC9wZGY6UHJvZHVjZXI+CjxwZGY6S2V5d29yZHM+KCk8L3BkZjpLZXl3b3Jkcz4KPC9yZGY6RGVzY3JpcHRpb24+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSd1dWlkOjgxZDY5ZmI5LThiYzctMTFlNC0wMDAwLTY2YjFkZDE4MTEwYycgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz48eG1wOk1vZGlmeURhdGU+MjAxNC0xMi0yMlQwMDo0OToyMCswMTowMDwveG1wOk1vZGlmeURhdGU+Cjx4bXA6Q3JlYXRlRGF0ZT4yMDE0LTEyLTIyVDAwOjQ5OjIwKzAxOjAwPC94bXA6Q3JlYXRlRGF0ZT4KPHhtcDpDcmVhdG9yVG9vbD5QREZDcmVhdG9yIFZlcnNpb24gMS42LjA8L3htcDpDcmVhdG9yVG9vbD48L3JkZjpEZXNjcmlwdGlvbj4KPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9J3V1aWQ6ODFkNjlmYjktOGJjNy0xMWU0LTAwMDAtNjZiMWRkMTgxMTBjJyB4bWxuczp4YXBNTT0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLycgeGFwTU06RG9jdW1lbnRJRD0ndXVpZDo4MWQ2OWZiOS04YmM3LTExZTQtMDAwMC02NmIxZGQxODExMGMnLz4KPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9J3V1aWQ6ODFkNjlmYjktOGJjNy0xMWU0LTAwMDAtNjZiMWRkMTgxMTBjJyB4bWxuczpkYz0naHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8nIGRjOmZvcm1hdD0nYXBwbGljYXRpb24vcGRmJz48ZGM6dGl0bGU+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz50ZXN0X3dvcmQ8L3JkZjpsaT48L3JkZjpBbHQ+PC9kYzp0aXRsZT48ZGM6Y3JlYXRvcj48cmRmOlNlcT48cmRmOmxpPlNlYjwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6U2VxPjxyZGY6bGk+KCk8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpkZXNjcmlwdGlvbj48L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+CmVuZHN0cmVhbQplbmRvYmoKMiAwIG9iago8PC9Qcm9kdWNlcihHUEwgR2hvc3RzY3JpcHQgOS4wNikKL0NyZWF0aW9uRGF0ZShEOjIwMTQxMjIyMDA0OTIwKzAxJzAwJykKL01vZERhdGUoRDoyMDE0MTIyMjAwNDkyMCswMScwMCcpCi9UaXRsZShcMzc2XDM3N1wwMDB0XDAwMGVcMDAwc1wwMDB0XDAwMF9cMDAwd1wwMDBvXDAwMHJcMDAwZCkKL0NyZWF0b3IoXDM3NlwzNzdcMDAwUFwwMDBEXDAwMEZcMDAwQ1wwMDByXDAwMGVcMDAwYVwwMDB0XDAwMG9cMDAwclwwMDAgXDAwMFZcMDAwZVwwMDByXDAwMHNcMDAwaVwwMDBvXDAwMG5cMDAwIFwwMDAxXDAwMC5cMDAwNlwwMDAuXDAwMDApCi9BdXRob3IoXDM3NlwzNzdcMDAwU1wwMDBlXDAwMGIpCi9LZXl3b3JkcygpCi9TdWJqZWN0KCk+PmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDg0IDAwMDAwIG4gCjAwMDAwMDIyNjggMDAwMDAgbiAKMDAwMDAwMDQyNSAwMDAwMCBuIAowMDAwMDAwMjg0IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDI2NSAwMDAwMCBuIAowMDAwMDAwNTc3IDAwMDAwIG4gCjAwMDAwMDA1NDggMDAwMDAgbiAKMDAwMDAwMDY0MyAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDEwIC9Sb290IDEgMCBSIC9JbmZvIDIgMCBSCi9JRCBbPDBDQjIzMTA0NzQzNUIzM0JDRTBCMUM2ODgxRENGMDExPjwwQ0IyMzEwNDc0MzVCMzNCQ0UwQjFDNjg4MURDRjAxMT5dCj4+CnN0YXJ0eHJlZgoyNjQ4CiUlRU9GCg==",
    );
    expect(registeredUser?.approvedAt).toBe(null);

    await expect(page.getByTestId("form-success-title")).toHaveText(
      "Demande d'inscription terminée",
    );

    await prisma.user.delete({ where: { id: registeredUser?.id } });
  });
});
