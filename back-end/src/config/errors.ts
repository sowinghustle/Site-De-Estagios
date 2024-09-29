export class UnauthorizedError implements Error {
    name: string = 'Unauthorized Error';
    message: string = 'Você precisa estar logado para acessar este recurso.';
}
