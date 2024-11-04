import Joi from 'joi';
import { ValidationError } from './errors';

type ValueOrError<T, E extends Error = Error> = {
    isError: () => Promise<boolean>;
    getValue: () => Promise<T | E>;
    orElseThrow: (cb?: (err: E) => E | string) => Promise<T>;
};

type Result<T, E extends Error = Error> = ValueOrError<T, E>;

export function toResult<T, E extends Error = Error>(
    promise: Promise<T>
): Result<T, E> {
    return {
        async getValue() {
            try {
                return await promise;
            } catch (error) {
                return error as E;
            }
        },
        async isError() {
            return this.getValue() instanceof Error;
        },
        async orElseThrow(cb) {
            try {
                return await promise;
            } catch (error) {
                const ex = cb ? cb(error as E) : (error as Error);
                throw ex instanceof Error ? ex : new Error(ex);
            }
        },
    };
}

export function getValidationResult<T>(
    validationSchema: Joi.ObjectSchema<T>,
    value?: any
): T {
    const validationResult = validationSchema.validate(value);

    if (validationResult.error) {
        throw new ValidationError(
            validationResult.error.message,
            validationResult.error.details,
            validationResult.warning
        );
    }

    return validationResult.value;
}
