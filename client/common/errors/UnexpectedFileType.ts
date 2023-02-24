import CustomError from "common/errors/CustomError";

export default class UnexpectedFileType extends CustomError {
  constructor() {
    super(
      "Type de fichier non géré",
      "Le certificat est dans un format de fichier non géré pour le moment. "
    );
  }
}
