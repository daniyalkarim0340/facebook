class CustomError extends Error {
  constructor(message, statusCode) { // 👈 Message is 1st, Status is 2nd
    super(message);
    this.statusCode = statusCode;
  }
}
export default CustomError;