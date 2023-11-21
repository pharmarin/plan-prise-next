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
        .then((reCaptchaRes) => reCaptchaRes?.score as number | undefined)
        .catch((error) => {
          console.error("Error resolving captcha: ", error);
          return undefined;
        });
};

export default checkRecaptcha;
