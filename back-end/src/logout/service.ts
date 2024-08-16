import { DatabaseResolver } from '../database';

export class LogoutService {
    async handle(token: string): Promise<Error | undefined> {
        const db = await DatabaseResolver.getDatabase();
        await db.invalidateUserToken(token);
        return db.getError();
    }
}

const logoutService = new LogoutService();

export default logoutService;
