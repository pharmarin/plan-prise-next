const checkRecaptcha = async (
  gRecaptchaToken: string,
): Promise<number | undefined> => {
  return process.env.NODE_ENV === "test"
    ? await new Promise((resolve) => resolve(0.9))
    : await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET}&response=${gRecaptchaToken}`,
      })
        .then((reCaptchaRes) => reCaptchaRes.json())
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .then((reCaptchaRes) => reCaptchaRes?.score as number | undefined)
        .catch(() => undefined);
};

export default checkRecaptcha;
