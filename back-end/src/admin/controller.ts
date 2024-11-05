import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import {
    BadRequestError,
    NotFoundError,
    UnhandledError,
} from '../config/errors';
import { getValidationResult, toPromiseResult } from '../config/utils';
import userService from '../user/service';
import { AdminLoginSchema } from './schemas';
import adminService from './service';

export default class AdminController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(
            AdminLoginSchema,
            req.body
        ).orElseThrow();

        const admin = await toPromiseResult(
            adminService.findAdminByNameOrEmail(data.nameOrEmail)
        ).orElseThrow();

        if (!admin) {
            throw new NotFoundError(
                config.messages.adminNotFoundWithNameOrEmail
            );
        }

        if (!(await userService.comparePassword(admin.user, data.password))) {
            throw new BadRequestError(config.messages.wrongPassword);
        }

        const { expiresAt, token } = await toPromiseResult(
            authService.saveNewAccessToken(admin.user.id!)
        ).orElseThrow(
            (error) =>
                new UnhandledError(
                    error.message,
                    'Não foi possível realizar o login, tente novamente mais tarde.'
                )
        );

        return res
            .status(200)
            .cookie('token', token, config.project.cookieOptions)
            .send({
                success: true,
                token,
                expiresAt,
                message: config.messages.successfullLogin,
            });
    }
}
