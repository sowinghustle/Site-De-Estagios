import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import { UserToken } from '../token/model';
import tokenService from '../token/service';
import { User } from '../user/model';

export class AuthService {
    async findUserByValidUserToken(
        userToken: string
    ): Promise<Result<User | undefined>> {
        const toResult = buildToResult<User | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserByValidUserToken(userToken);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(user);
    }

    async saveNewUserToken(userId: number): Promise<Result<UserToken>> {
        const toResult = buildToResult<UserToken>();
        const conn = await DatabaseResolver.getConnection();
        const userToken = await conn.saveNewUserToken(
            tokenService.generateUserToken(),
            userId
        );
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(userToken!);
    }

    async invalidateToken(
        token: string
    ): Promise<Result<UserToken | undefined>> {
        const toResult = buildToResult<UserToken | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const userToken = await conn.invalidateUserToken(token);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(userToken);
    }
}

const authService = new AuthService();

export default authService;
