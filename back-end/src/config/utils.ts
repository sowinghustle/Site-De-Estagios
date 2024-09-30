import Joi from 'joi';
import { ValidationError } from './errors';

type ValueOrError<T, E extends Error = Error> =
    | { value: T; isError: false }
    | { value: E; isError: true };

export type Result<T, E extends Error = Error> = ValueOrError<T, E> & {
    orElseThrow: (cb?: (err: E) => E | string) => T;
};

function success<T, E extends Error = Error>(value: T): Result<T, E> {
    return {
        value,
        isError: false,
        orElseThrow: (_) => value,
    };
}

function error<T, E extends Error = Error>(error: E): Result<T, E> {
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

export function buildToResult<T, E extends Error = Error>() {
    return function (value: T | E): Result<T, E> {
        if (value instanceof Error) {
            return error<T, E>(value as E);
        }

        return success<T, E>(value);
    };
}

export function getValidationResult<T>(
    validationSchema: Joi.ObjectSchema<T>,
    value?: any
): Result<T, ValidationError> {
    const toResult = buildToResult<T, ValidationError>();
    const validationResult = validationSchema.validate(value);

    if (!validationResult.error) {
        return toResult(validationResult.value);
    }

    const error = new ValidationError(
        validationResult.error.message,
        validationResult.error.details,
        validationResult.warning
    );

    return toResult(error);
}
