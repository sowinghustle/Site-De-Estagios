import { Response } from 'express';
import { ValidationError, ValidationResult } from 'joi';
import config from '.';

type ValueOrError<T> =
    | { value: T; isError: false }
    | { value: Error; isError: true };

export type Result<T> = ValueOrError<T> & {
    orElseThrow: (cb?: (err: Error) => Error | string) => T;
};



function success<T>(value: T): Result<T> {
    return {
        value,
        isError: false,
        orElseThrow: (_) => value,
    };
}

function error<T>(error: Error): Result<T> {
    return {
        value: error,
        isError: true,
        orElseThrow(cb) {
            if (cb) {
                const ex = cb(error);
                throw ex instanceof Error ? ex : new Error(ex);
            }
            throw error;
        },
    };
}

export function buildToResult<T>() {
    return function (value: T | Error): Result<T> {
        if (value instanceof Error) {
            return error<T>(value);
        }

        return success<T>(value);
    };
}

export function getValidationResult<T>(
    response: Response,
    validationResult: ValidationResult<T>,
    handleError = (validationError: ValidationError) => validationError.message
): T | undefined {
    if (!validationResult.error) {
        return validationResult.value;
    }

    response.status(400);

    const errorMessage = handleError(validationResult.error);

    if (config.project.environment !== 'production') {
        response.send({
            success: false,
            message: errorMessage,
            details: validationResult.error.details,
            stack: validationResult.error.stack,
            warning: validationResult.warning,
        });
    } else response.send({ success: false, message: errorMessage });
}
