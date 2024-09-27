import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import { UserToken } from '../token/model';

export class LogoutService {
    async handle(token: string): Promise<Result<UserToken>> {
        const toResult = buildToResult<UserToken>();
        const conn = await DatabaseResolver.getConnection();
        const userToken = await conn.invalidateUserToken(token);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(userToken!);
    }
}

const logoutService = new LogoutService();

export default logoutService;
