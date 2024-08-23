import { DatabaseResolver } from '../database';

export class LogoutService {
    async handle(token: string): Promise<Error | undefined> {
        const conn = await DatabaseResolver.getConnection();
        await conn.invalidateUserToken(token);
        return conn.getError();
    }
}

const logoutService = new LogoutService();

export default logoutService;
