import { env } from "../../env.mjs";

const checkRecaptcha = async (
  gRecaptchaToken: string,
): Promise<number | undefined> =>
  process.env.CI === "true"
    ? 0.9
    : await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${env.RECAPTCHA_SECRET}&response=${gRecaptchaToken}`,
      })
        .then((reCaptchaRes) => reCaptchaRes.json())
        .then((reCaptchaRes) => reCaptchaRes?.score as number | undefined)
        .catch(() => undefined);

export default checkRecaptcha;
