export class UnauthorizedError implements Error {
    name: string = 'Unauthorized Error';
    message: string = 'Você precisa estar logado para acessar este recurso.';
}

export class BadRequestError implements Error {
    name: string = 'Bad Request Error';
    message: string;

    public constructor(message: string) {
        this.message = message;
    }
}

export class NotFoundError implements Error {
    name: string = 'Not Found Error';
    message: string;

    public constructor(message: string) {
        this.message = message;
    }
}
