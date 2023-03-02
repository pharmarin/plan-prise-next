import CustomError from "@/common/errors/CustomError";

export default class PasswordResetErrorMissingParam extends CustomError {
  constructor(message?: string) {
    super(
      message ?? "Impossible de réinitialiser le mot de passe",
      "Des paramètres manquent à l'URL fourni. Veuillez utiliser le lien fourni dans le mail de demande de réinitialisation du mot de passe. "
    );
  }
}
