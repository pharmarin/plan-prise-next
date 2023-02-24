const checkRecaptcha = async (gRecaptchaToken: string) => {
  return await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${gRecaptchaToken}`,
  })
    .then((reCaptchaRes) => reCaptchaRes.json())
    .then((reCaptchaRes) => reCaptchaRes?.score as number | undefined)
    .catch(() => undefined);
};

export default checkRecaptcha;
