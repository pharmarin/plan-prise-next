import CustomError from "@/common/errors/CustomError";

export default class PasswordMismatch extends CustomError {
  constructor() {
    super("Le mot de passe entré ne correspond pas au mot de passe enregistré");
  }
}
