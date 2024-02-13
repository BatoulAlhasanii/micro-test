import {CustomError} from "./custom-error";
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
    statusCode: number = 422;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((err): { message: string; field?: string; } => {
            if (err.type === 'field') {
                return { message: err.msg, field: err.path };
            }
            return {message: err.msg };
        });
    }

}