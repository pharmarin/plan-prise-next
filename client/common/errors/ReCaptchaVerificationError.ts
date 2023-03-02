import CustomError from "@/common/errors/CustomError";

export default class ReCaptchaVerificationError extends CustomError {
  constructor() {
    super("Le ReCAPTCHA n'a pas pu être validé");
  }
}
