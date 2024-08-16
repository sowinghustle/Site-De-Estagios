import { DatabaseResolver } from '../database';
import { UserToken } from '../token/model';
import tokenService from '../token/service';

export class AuthService {
    async saveNewUserToken(userId: number) {
        const db = await DatabaseResolver.getDatabase();
        const userToken = await db.saveNewUserToken(
            tokenService.generateUserToken(),
            userId
        );

        const error = db.getError();

        if (error) return { error };
        return { userToken: userToken! };
    }
}

const authService = new AuthService();

export default authService;
