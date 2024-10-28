import { buildToResult, Result } from '../config/utils';
import { DatabaseResolver } from '../database';
import { AccessToken, ResetPasswordToken } from '../token/model';
import tokenService from '../token/service';
import { User } from '../user/model';

export class AuthService {
    async findValidResetPasswordToken(
        token: string
    ): Promise<Result<ResetPasswordToken | undefined>> {
        const toResult = buildToResult<ResetPasswordToken | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const resetToken = await conn.findValidResetPasswordToken(token);
        const error = conn.getError();

        if (error) return toResult(error);
        return toResult(resetToken);
    }

    async findUserByValidAccessToken(
        accessToken: string
    ): Promise<Result<User | undefined>> {
        const toResult = buildToResult<User | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserByValidAccessToken(accessToken);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(user);
    }

    async saveNewResetPasswordToken(
        email: string
    ): Promise<Result<ResetPasswordToken>> {
        const toResult = buildToResult<ResetPasswordToken>();
        const conn = await DatabaseResolver.getConnection();
        const resetPasswordToken = await conn.saveNewResetPasswordToken(
            email,
            tokenService.generateResetPasswordToken()
        );
        const error = conn.getError();

        if (error) return toResult(error);
        return toResult(resetPasswordToken!);
    }

    async saveNewAccessToken(userId: number): Promise<Result<AccessToken>> {
        const toResult = buildToResult<AccessToken>();
        const conn = await DatabaseResolver.getConnection();
        const accessToken = await conn.saveNewAccessToken(
            tokenService.generateAccessToken(),
            userId
        );
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(accessToken!);
    }

    async invalidateAccessToken(
        token: string
    ): Promise<Result<AccessToken | undefined>> {
        const toResult = buildToResult<AccessToken | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const accessToken = await conn.invalidateAccessToken(token);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(accessToken);
    }

    async invalidateResetPasswordToken(
        token: string
    ): Promise<Result<ResetPasswordToken | undefined>> {
        const toResult = buildToResult<ResetPasswordToken | undefined>();
        const conn = await DatabaseResolver.getConnection();
        const resetPassToken = await conn.invalidateResetPasswordToken(token);
        const error = conn.getError();

        if (error) {
            return toResult(error);
        }

        return toResult(resetPassToken);
    }
}

const authService = new AuthService();

export default authService;
