export const METHOD_NOT_IMPLEMENTED = "Method not implemented."

export class DefaultError extends Error {
    status: number;
    constructor(status = 500, message = 'Internal Server Error') {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

export class MethodNotImplementedError extends DefaultError {
    constructor(message = 'Method Not Impplemented') {
        super(501, message);
        this.message = message;
    }
}

export class NotFoundError extends DefaultError {
    constructor(message = 'Not found') {
        super(404, message)
        this.message = message;
    }
}

export class invalidInputError extends DefaultError {
    constructor(message = 'Invalid Input') {
        super(400, message)
        this.message = message;
    }
}
