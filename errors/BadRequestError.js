class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "Validation Error";
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
