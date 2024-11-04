import Joi from 'joi';
import { ValidationError } from './errors';

type ValueOrError<T, E extends Error = Error> =
    | {
          value: T;
          isError: false;
          isSuccess: true;
          orElseThrow: (cb?: (err: E) => E | string) => T;
          orElse: <U>(alternative: U) => T;
          map: <U>(fn: (val: T) => U) => ValueOrError<U, E>;
      }
    | {
          value: E;
          isError: true;
          isSuccess: false;
          orElseThrow: (cb?: (err: E) => E | string) => void;
          orElse: <U>(alternative: U) => U;
          map: <U>(fn: (val: T) => U) => ValueOrError<U, E>;
      };

type AsyncValueOrError<T, E extends Error = Error> = {
    resolveAsync: () => Promise<ValueOrError<T, E>>;
    getValueAsync: () => Promise<T | E>;
    getErrorAsync: () => Promise<E | null>;
    isErrorAsync: () => Promise<boolean>;
    isSuccessAsync: () => Promise<boolean>;
    orElseThrowAsync: (cb?: (err: E) => E | string) => Promise<T>;
    orElseAsync: <U>(alternative: U | Promise<U>) => Promise<T | U>;
    mapAsync: <U>(fn: (val: T) => U | Promise<U>) => AsyncValueOrError<U, E>;
};

export function toResult<T, E extends Error = Error>(
    promise: Promise<T>
): AsyncValueOrError<T, E> {
    return {
        async getValueAsync() {
            try {
                return await promise;
            } catch (error) {
                return error as E;
            }
        },

        async isErrorAsync() {
            const value = await this.getValueAsync();
            if (value instanceof Error) return true;
            return false;
        },

        async isSuccessAsync() {
            const value = await this.getValueAsync();
            if (value instanceof Error) return false;
            return true;
        },

        async orElseAsync<U>(alternative: U | Promise<U>) {
            try {
                return await promise;
            } catch {
                return await alternative;
            }
        },

        async orElseThrowAsync(cb) {
            try {
                return await promise;
            } catch (error) {
                const ex = cb ? cb(error as E) : (error as Error);
                throw ex instanceof Error ? ex : new Error(ex);
            }
        },

        async resolveAsync(): Promise<ValueOrError<T, E>> {
            const transform = <T, E extends Error = Error>(
                value: T | E
            ): ValueOrError<T, E> => {
                if (value instanceof Error) {
                    return {
                        value,
                        isError: true,
                        isSuccess: false,
                        orElseThrow(cb) {
                            if (cb) {
                                const ex = cb(value);
                                throw ex instanceof Error ? ex : new Error(ex);
                            }
                            throw value;
                        },
                        orElse: <U>(alternative: U) => alternative,
                        map: <U>(_: (val: T) => U) => transform<U, E>(value),
                    };
                }

                return {
                    value,
                    isError: false,
                    isSuccess: true,
                    orElseThrow: () => value,
                    orElse: <U>(_: U) => value,
                    map: <U>(fn: (val: T) => U) => transform<U, E>(fn(value)),
                };
            };

            return await promise
                .then((value) => transform<T, E>(value))
                .catch((err) => transform<T, E>(err));
        },

        mapAsync<U>(fn: (val: T) => U | Promise<U>): AsyncValueOrError<U, E> {
            const newPromise = this.getValueAsync().then((value) => {
                if (value instanceof Error) throw value;
                return fn(value);
            });
            return toResult(newPromise);
        },

        async getErrorAsync() {
            const value = await this.getValueAsync();
            if (value instanceof Error) return value;
            return null;
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
