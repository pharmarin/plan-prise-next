import CustomError from "common/errors/CustomError";

export default class ReCaptchaNotLoaded extends CustomError {
  constructor() {
    super("Le service ReCAPTCHA n'a pas pu être chargé");
  }
}
