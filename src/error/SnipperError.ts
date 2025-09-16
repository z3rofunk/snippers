class SnipperError extends Error {
  /**
   * Constructs a new SnipperError instance.
   *
   * @constructor
   * @param message - The error message.
   * @param cause - Optional cause of the error.
   */
  constructor(message: string, cause?: string) {
    super(message);

    this.name = 'SnipperError';
    this.message = message;
    this.cause = cause;

    this.stack = '';
  }
}

const isSnipperError = (err: unknown): err is SnipperError => {
  return err instanceof SnipperError;
};

export { SnipperError, isSnipperError };
