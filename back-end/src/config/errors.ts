import Joi from 'joi';
import config from '.';

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

export class UnhandledError extends Error {
    public userFriendlyMessage: string;

    public constructor(message: string, userFriendlyMessage?: string) {
        super(message);

        this.userFriendlyMessage =
            userFriendlyMessage ?? config.messages.serverUnhandledException;

        if (config.project.environment === 'development') {
            this.userFriendlyMessage = message;
        }
    }
}
