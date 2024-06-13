/**
 * Represents a default error with a status code.
 */
export class DefaultError extends Error {
    status: number;

    /**
     * Initialize a new DefaultError object.
     * @param status - The HTTP status code of the error (default: 500).
     * @param message - The error message (default: 'Internal Server Error').
     */
    constructor(status = 500, message = 'Internal Server Error') {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

/**
 * Represents an error for a method that is not implemented.
 */
export class MethodNotImplementedError extends DefaultError {
    /**
     * Initialize a new MethodNotImplementedError object.
     * @param message - The error message (default: 'Method Not Implemented').
     */
    constructor(message = 'Method Not Implemented') {
        super(501, message);
        this.message = message;
    }
}

/**
 * Represents a "Not Found" error.
 */
export class NotFoundError extends DefaultError {
    /**
     * Initialize a new NotFoundError object.
     * @param message - The error message (default: 'Not found').
     */
    constructor(message = 'Not found') {
        super(404, message);
        this.message = message;
    }
}

/**
 * Represents an "Invalid Input" error.
 */
export class InvalidInputError extends DefaultError {
    /**
     * Initialize a new InvalidInputError object.
     * @param message - The error message (default: 'Invalid Input').
     */
    constructor(message = 'Invalid Input') {
        super(400, message);
        this.message = message;
    }
}
