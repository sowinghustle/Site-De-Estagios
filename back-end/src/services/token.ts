import { randomBytes, randomUUID } from 'crypto';
import { ResetPasswordToken } from '../models/reset-password-token';
import { DatabaseResolver } from '../modules/database';

class TokenService {
    generateAccessToken(): string {
        return randomUUID();
    }

    generateResetPasswordToken(): string {
        return randomBytes(32).toString('hex');
    }

    async findValidResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const resetPasswordToken = conn.findValidResetPasswordToken(
            email,
            token
        );

        conn.throwIfHasError();

        return resetPasswordToken;
    }
}

const tokenService = new TokenService();

export default tokenService;
