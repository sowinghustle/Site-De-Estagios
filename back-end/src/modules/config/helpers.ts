export type MergeReplace<T, U> = Omit<T, keyof U> & U;
export type Replace<
    T,
    U extends { [K in keyof T]?: T[K] | unknown },
> = MergeReplace<T, U>;

export type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};

export function is<T>(
    value: unknown,
    constructor: new (...args: any[]) => T
): value is T {
    return value instanceof constructor;
}

export function deepFreeze<T extends object>(obj: T): Immutable<T> {
    Object.keys(obj).forEach((key) => {
        const prop = obj[key as keyof T];
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });
    return Object.freeze(obj);
}

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type MapperDictionary<From extends object, To extends object> = {
    [K in keyof To]: keyof From | ((source: From) => To[K]);
};
