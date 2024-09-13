import { DatabaseResolver } from '../database';

export class LogoutService {
    async handle(token: string): Promise<Error | undefined> {
        const conn = await DatabaseResolver.getConnection();
        await conn.invalidateUserToken(token);
        const error = conn.getError();
        return error;
    }
}

const logoutService = new LogoutService();

export default logoutService;
