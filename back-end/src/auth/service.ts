import { ResultOrErrorObject } from '../config/utils';
import { DatabaseResolver } from '../database';
import { UserToken } from '../token/model';
import tokenService from '../token/service';

export class AuthService {
    async saveNewUserToken(
        userId: number
    ): Promise<ResultOrErrorObject<{ userToken: UserToken }>> {
        const conn = await DatabaseResolver.getConnection();
        const userToken = await conn.saveNewUserToken(
            tokenService.generateUserToken(),
            userId
        );

        const error = conn.getError();

        if (error) return { error };
        return { userToken: userToken! };
    }
}

const authService = new AuthService();

export default authService;
