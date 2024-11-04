import { NextFunction, Request, Response } from 'express';
import { mapUserToJson as mapUserToData } from '../models/user';
import config from '../modules/config';
import { NotFoundError } from '../modules/config/errors';
import { getValidationResult, toResult } from '../modules/config/utils';
import { ForgotPasswordSchema, ResetPasswordSchema } from '../schemas/user';
import authService from '../services/auth';
import emailService from '../services/email';
import userService from '../services/user';

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
        const data = getValidationResult(ForgotPasswordSchema, req.body);
        const user = await userService.findUserByEmail(data.email);

        if (!user) {
            throw new NotFoundError(config.messages.userWithEmailNotFound);
        }

        const resetPasswordToken = await authService.saveNewResetPasswordToken(
            data.email
        );

        await toResult(
            emailService.sendResetPasswordEmail(user, resetPasswordToken.token)
        ).getValue();

        return res.send({
            success: true,
            expiresAt: resetPasswordToken.expiresAt,
        });
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        const data = getValidationResult(ResetPasswordSchema, req.body);

        const resetPasswordToken =
            await authService.findValidResetPasswordToken(
                data.email,
                data.token
            );

        if (!resetPasswordToken) {
            throw new NotFoundError(config.messages.invalidToken);
        }

        await userService.updatePasswordByEmail(
            resetPasswordToken.email,
            data.newPassword
        );

        await authService.invalidateResetPasswordToken(
            resetPasswordToken.token
        );

        return res.send({
            success: true,
        });
    }
}
