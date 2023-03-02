import CustomError from "@/common/errors/CustomError";

export default class UnexpectedMethod extends CustomError {
  constructor() {
    super("Cette méthode n'est pas supportée pour cette requête");
  }
}
