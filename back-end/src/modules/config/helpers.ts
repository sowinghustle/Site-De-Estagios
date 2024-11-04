export type MergeReplace<T, U> = Omit<T, keyof U> & U;
export type Replace<
    T,
    U extends { [K in keyof T]?: T[K] | unknown },
> = MergeReplace<T, U>;
