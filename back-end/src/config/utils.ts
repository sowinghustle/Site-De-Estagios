import { Response } from 'express';
import { ValidationError, ValidationResult } from 'joi';
import config from '.';

type ErrorHandler = (validationError: ValidationError) => string;

const defaultErrorHandler: ErrorHandler = (
    validationError: ValidationError
) => {
    return validationError.message;
};

export function handleValidationResult<T>(
    response: Response,
    validationResult: ValidationResult<T>,
    handleError = defaultErrorHandler
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

export type ResultOrErrorObject<T extends Object> =
    | (T & { error?: never })
    | ({ [key in keyof T]?: never } & { error: Error });

export type ResultOrError<T> = ResultOrErrorObject<{ value: T }>;
