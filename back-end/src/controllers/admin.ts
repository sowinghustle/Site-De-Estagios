import { Request, Response } from 'express';
import config from '../modules/config';
import { NotFoundError, UnhandledError } from '../modules/config/errors';
import { getValidationResult, toResult } from '../modules/config/utils';
import { AdminLoginSchema } from '../schemas/admin';
import adminService from '../services/admin';
import authService from '../services/auth';
import userService from '../services/user';

export default class AdminController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(AdminLoginSchema, req.body);
        const admin = await adminService.findAdminByNameOrEmail(
            data.nameOrEmail
        );

        if (!admin) {
            throw new NotFoundError(
                config.messages.adminNotFoundWithNameOrEmail
            );
        }

        await userService.ensurePasswordsMatchAsync(admin.user, data.password);

        const accessToken = await toResult(
            authService.saveNewAccessToken(admin.user.id!)
        ).orElseThrow(
            (err) =>
                new UnhandledError(
                    err.message,
                    'Não foi possível realizar o login, tente novamente mais tarde.'
                )
        );

        return res
            .status(200)
            .cookie('token', accessToken.token, config.project.cookieOptions)
            .send({
                success: true,
                token: accessToken.token,
                expiresAt: accessToken.expiresAt,
                message: config.messages.successfullLogin,
            });
    }
}
