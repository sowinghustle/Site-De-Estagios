import Joi from 'joi';
import { ValidationError } from './errors';
import { DeepPartial, MapperDictionary } from './helpers';

type ValueOrError<T, E extends Error = Error> =
    | {
          value: T;
          isError: false;
          isSuccess: true;
          orElseThrow: (cb?: (err: E) => E | string) => T;
          orElse: <U>(alternative: U) => T;
          map: <U>(fn: (val: T) => U) => ValueOrError<U, Error>;
          validate: <U = T>(
              predicate: (val: T) => boolean,
              error: Error
          ) => ValueOrError<U, Error>;
      }
    | {
          value: E;
          isError: true;
          isSuccess: false;
          orElseThrow: (cb?: (err: E) => E | string) => never;
          orElse: <U>(alternative: U) => U;
          map: <U>(fn: (val: T) => U) => ValueOrError<U, Error>;
          validate: <U = T>(
              predicate: (val: T) => boolean,
              error: Error
          ) => ValueOrError<U, Error>;
      };

type AsyncValueOrError<T, E extends Error = Error> = {
    resolveAsync: () => Promise<ValueOrError<T, E>>;
    waitAsync: () => Promise<void>;
    getValueAsync: () => Promise<T | E>;
    getErrorAsync: () => Promise<E | null>;
    isErrorAsync: () => Promise<boolean>;
    isSuccessAsync: () => Promise<boolean>;
    orElseThrowAsync: (cb?: (err: E) => E | string) => Promise<T>;
    orElseAsync: <U>(alternative: U | Promise<U>) => Promise<T | U>;
    validateAsync: <U = T>(
        predicate: (val: T) => boolean | Promise<boolean>,
        error: Error
    ) => AsyncValueOrError<U, Error>;
    mapAsync: <U>(
        fn: (val: T) => U | Promise<U>
    ) => AsyncValueOrError<U, Error>;
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
            return value instanceof Error;
        },

        async isSuccessAsync() {
            const value = await this.getValueAsync();
            return !(value instanceof Error);
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

        async waitAsync() {
            await promise.catch(() => {});
        },

        async resolveAsync() {
            const transform = <T, E extends Error = Error>(
                value: T | E
            ): ValueOrError<T, E> => {
                if (value instanceof Error) {
                    return {
                        value,
                        isError: true,
                        isSuccess: false,
                        map: <U>(_: (val: T) => U) =>
                            transform<U, Error>(value),
                        orElse: <U>(alternative: U) => alternative,
                        orElseThrow(cb) {
                            if (cb) {
                                const ex = cb(value);
                                throw ex instanceof Error ? ex : new Error(ex);
                            }
                            throw value;
                        },
                        validate: <U = T>(
                            predicate: (val: T) => boolean,
                            error: Error
                        ) => transform<U, Error>(value),
                    };
                }

                return {
                    value,
                    isError: false,
                    isSuccess: true,
                    map: <U>(fn: (val: T) => U) =>
                        transform<U, Error>(fn(value)),
                    orElse: <U>(_: U) => value,
                    orElseThrow: () => value,
                    validate: <U = T>(
                        predicate: (val: T) => boolean,
                        error: Error
                    ) =>
                        predicate(value)
                            ? transform<U, Error>(value as unknown as U)
                            : transform<U, Error>(error),
                };
            };

            return await promise
                .then((value) => transform<T, E>(value))
                .catch((err) => transform<T, E>(err));
        },

        async getErrorAsync() {
            const value = await this.getValueAsync();
            return value instanceof Error ? value : null;
        },

        mapAsync<U>(fn: (val: T) => U | Promise<U>) {
            const newPromise = this.getValueAsync().then((value) => {
                if (value instanceof Error) throw value;
                return fn(value);
            });
            return toResult(newPromise);
        },

        validateAsync<U = T>(
            predicate: (val: T) => boolean | Promise<boolean>,
            error: Error
        ) {
            const newPromise = this.getValueAsync().then(async (value) => {
                if (value instanceof Error) throw value;
                if (!(await predicate(value))) throw error;
                return value as unknown as U;
            });
            return toResult(newPromise);
        },
    };
}

export function validateSchema<T>(
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

export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
    for (const key in source) {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (
            sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue)
        ) {
            target[key] = deepMerge(
                { ...targetValue } as T[Extract<keyof T, string>],
                sourceValue
            ) as T[Extract<keyof T, string>];
        } else {
            target[key] = sourceValue as T[Extract<keyof T, string>];
        }
    }
    return target;
}

export function mapObject<From extends object, To extends object>(
    sourceObject: From,
    mapper: MapperDictionary<From, To>
): To {
    const result: Partial<To> = {};

    for (const toKey in mapper) {
        const mapping = mapper[toKey];

        if (typeof mapping === 'function') {
            result[toKey] = mapping(sourceObject);
        } else if (typeof mapping === 'string' && mapping in sourceObject) {
            result[toKey] = sourceObject[
                mapping as keyof From
            ] as unknown as To[typeof toKey];
        }
    }

    return result as To;
}
