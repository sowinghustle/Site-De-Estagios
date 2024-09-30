import Joi from 'joi';

export class UnauthorizedError extends Error {
    readonly name = 'UnauthorizedError';

    public constructor() {
        super('Você precisa estar logado para acessar este recurso.');
    }
}

export class BadRequestError extends Error {
    readonly name = 'BadRequestError';

    public constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
    readonly name = 'NotFoundError';

    public constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends Joi.ValidationError implements Error {
    warning: Joi.ValidationError | undefined;

    public constructor(
        message: string,
        details: Joi.ValidationErrorItem[],
        warning?: Joi.ValidationError | undefined,
        original?: any
    ) {
        super(message, details, original);
        this.warning = warning;
    }
}
