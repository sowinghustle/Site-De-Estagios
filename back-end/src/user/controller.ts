import { NextFunction, Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { NotFoundError } from '../config/errors';
import { getValidationResult, toPromiseResult } from '../config/utils';
import emailService from '../email/service';
import { mapUserToJson as mapUserToData } from './model';
import { ForgotPasswordSchema, ResetPasswordSchema } from './schemas';
import userService from './service';

export default class UserController {
    async me(req: Request, res: Response, next: NextFunction) {
        return res.send({
            success: true,
            user: mapUserToData(req.user!),
        });
    }

    async requestResetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const data = getValidationResult(
            ForgotPasswordSchema,
            req.body
        ).orElseThrow();

        const user = await toPromiseResult(
            userService.findUserByEmail(data.email)
        ).orElseThrow();

        if (!user) {
            throw new NotFoundError(config.messages.userWithEmailNotFound);
        }

        const resetPassword = await toPromiseResult(
            authService.saveNewResetPasswordToken(data.email)
        ).orElseThrow();

        await emailService.sendResetPasswordEmail(user, resetPassword.token);

        return res.send({
            success: true,
            expiresAt: resetPassword.expiresAt,
        });
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        const data = getValidationResult(
            ResetPasswordSchema,
            req.body
        ).orElseThrow();

        const resetPasswordToken = (
            await authService.findValidResetPasswordToken(
                data.email,
                data.token
            )
        ).orElseThrow();

        if (!resetPasswordToken) {
            throw new NotFoundError(config.messages.invalidToken);
        }

        await toPromiseResult(
            userService.updatePasswordByEmail(
                resetPasswordToken.email,
                data.newPassword
            )
        ).orElseThrow();

        await authService.invalidateResetPasswordToken(
            resetPasswordToken.token
        );

        return res.send({
            success: true,
        });
    }
}
