import jsonErrors from "./errors.json";

export type ErrorObject = Record<
  string,
  string | { message: string; infos?: string }
>;

const ERRORS = Object.freeze(jsonErrors);

export const DEFAULT_ERROR = ERRORS.SERVER_ERROR;

class PP_Error extends Error {
  private errors = ERRORS satisfies ErrorObject;

  public code: keyof typeof this.errors;
  public infos?: string;

  constructor(code: keyof typeof ERRORS) {
    super();
    this.code = code;
    this.message = this.getMessage(code);
    this.infos = this.getInfos(code);
  }

  private getMessage(code: keyof typeof this.errors) {
    if (
      code &&
      typeof code === "string" &&
      this.errors &&
      Object.keys(this.errors).includes(code)
    ) {
      const error = this.errors[code];
      if (typeof error === "string") {
        return error;
      } else if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        return error.message;
      }
    }

    return DEFAULT_ERROR;
  }

  private getInfos(code: keyof typeof this.errors) {
    if (
      typeof code === "string" &&
      this.errors &&
      Object.keys(this.errors).includes(code)
    ) {
      const error = this.errors[code];
      if (
        error &&
        typeof error === "object" &&
        "infos" in error &&
        typeof error.infos === "string"
      ) {
        return error.infos;
      }
    }
  }
}

export default PP_Error;
