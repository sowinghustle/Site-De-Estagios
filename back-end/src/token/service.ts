import { randomBytes, randomUUID } from 'crypto';
import config from '../config';
import { BadRequestError, NotFoundError } from '../config/errors';
import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import { ResetPasswordToken } from './model';

class TokenService {
    generateAccessToken(): string {
        return randomUUID();
    }
    generateResetPasswordToken(): string {
        return randomBytes(32).toString('hex');
    }
    async findValidResetPasswordToken(
        token: string
    ): Promise<Result<ResetPasswordToken>> {
        const toResult = buildToResult<ResetPasswordToken>();
        const conn = await DatabaseResolver.getConnection();
        const resetPasswordToken =
            await conn.findValidResetPasswordToken(token);

        if (conn.getError()) {
            return toResult(conn.getError()!);
        }

        if (!resetPasswordToken) {
            const error = new NotFoundError(config.messages.invalidToken);
            return toResult(error);
        }

        if (resetPasswordToken.expiredAt) {
            const error = new BadRequestError(config.messages.invalidToken);
            return toResult(error);
        }

        return toResult(resetPasswordToken);
    }
}

const tokenService = new TokenService();

export default tokenService;
