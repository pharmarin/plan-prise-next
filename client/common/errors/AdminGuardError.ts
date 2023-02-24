import CustomError from "common/errors/CustomError";

export default class AdminGuardError extends CustomError {
  constructor() {
    super(
      "Non authorisé",
      "Vous tentez de charger une page réservée aux administrateurs du site, cet accès ne vous est pas autorisé. "
    );
  }
}
