import CustomError from "@/common/errors/CustomError";

export default class UserNotApproved extends CustomError {
  constructor() {
    super(
      "Votre inscription n'a pas encore été vérifiée. ",
      "Vous recevrez un mail dès que votre compte sera activé. "
    );
  }
}
