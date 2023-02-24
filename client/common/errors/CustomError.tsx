export default class CustomError extends Error {
  constructor(message?: string, details?: string) {
    super(message);

    this.details = details;
  }

  details?: string;

  setMessage(message: string) {
    this.message = message;
  }

  setDetails(details: string) {
    this.details = details;
  }
}
