import CustomError from "@/common/errors/CustomError";

export default class UserNotLoaded extends CustomError {
  constructor() {
    super("Les données de l'utilisateur n'ont pas pu être chargées. ");
  }
}
