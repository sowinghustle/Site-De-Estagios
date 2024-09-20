import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import { UserToken } from '../token/model';
import tokenService from '../token/service';

export class AuthService {
    async saveNewUserToken(userId: number): Promise<Result<UserToken>> {
        const toResult = buildToResult<UserToken>();
        const conn = await DatabaseResolver.getConnection();
        const userToken = await conn.saveNewUserToken(
            tokenService.generateUserToken(),
            userId
        );
        const error = conn.getError();
        return toResult(error ?? userToken!);
    }
}

const authService = new AuthService();

export default authService;
