import Joi from 'joi';
import { ValidationError } from './errors';

type ValueOrError<T, E extends Error = Error> =
    | {
          value: T;
          isError: false;
          orElseThrow: (cb?: (err: E) => E | string) => T;
      }
    | {
          value: E;
          isError: true;
          orElseThrow: (cb?: (err: E) => E | string) => void;
          getError: () => E;
          orElse: <U>(alternative: U) => T | U;
      };

type AsyncValueOrError<T, E extends Error = Error> = {
    isErrorAsync: () => Promise<boolean>;
    getValueAsync: () => Promise<T | E>;
    orElseThrowAsync: (cb?: (err: E) => E | string) => Promise<T>;
    resolveAsync: () => Promise<ValueOrError<T, E>>;
    mapAsync: <U>(fn: (val: T) => U | Promise<U>) => AsyncValueOrError<U, E>;
    flatMapAsync: <U>(
        fn: (val: T) => AsyncValueOrError<U, E>
    ) => AsyncValueOrError<U, E>;
    unwrapAsync: () => Promise<T>;
    getErrorAsync: () => Promise<E | null>;
    orElseAsync: <U>(alternative: U | Promise<U>) => Promise<T | U>;
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
            return (await this.getValueAsync()) instanceof Error;
        },

        async orElseThrowAsync(cb) {
            try {
                return await promise;
            } catch (error) {
                const ex = cb ? cb(error as E) : (error as Error);
                throw ex instanceof Error ? ex : new Error(ex);
            }
        },

        async resolveAsync() {
            try {
                const value = await promise;

                return {
                    value,
                    isError: false,
                    orElseThrow: (_) => value,
                };
            } catch (error: any) {
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
                    getError: () => error,
                    orElse: <U>(alternative: U) => alternative,
                };
            }
        },

        mapAsync<U>(fn: (val: T) => U | Promise<U>): AsyncValueOrError<U, E> {
            const newPromise = this.getValueAsync().then((value) => {
                if (value instanceof Error) throw value;
                return fn(value);
            });
            return toResult(newPromise);
        },

        flatMapAsync<U>(
            fn: (val: T) => AsyncValueOrError<U, E>
        ): AsyncValueOrError<U, E> {
            const newPromise = this.getValueAsync()
                .then((value) => {
                    if (value instanceof Error) throw value;
                    return fn(value).getValueAsync();
                })
                .then((result) => {
                    if (result instanceof Error) throw result;
                    return result;
                });
            return toResult(newPromise);
        },

        async unwrapAsync() {
            const value = await this.getValueAsync();
            if (value instanceof Error) throw value;
            return value;
        },

        async getErrorAsync() {
            const value = await this.getValueAsync();
            return value instanceof Error ? value : null;
        },

        async orElseAsync<U>(alternative: U | Promise<U>) {
            try {
                return await promise;
            } catch {
                return await alternative;
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
