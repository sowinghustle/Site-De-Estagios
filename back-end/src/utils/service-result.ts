type ServiceErrorResult<T> = { [key in keyof T]?: never } & {
    error: Error;
};
export type ServiceResult<T extends Object> =
    | (T & { error?: never })
    | ServiceErrorResult<T>;
