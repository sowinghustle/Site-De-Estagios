import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { getValidationResult } from '../config/utils';
import { AdminLoginSchema } from './schemas';
import adminService from './service';

export default class AdminController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(
            res,
            AdminLoginSchema.validate(req.body)
        );

        if (!data) return res.end();

        const admin = (
            await adminService.findAdminByNameOrEmail(data.nameOrEmail)
        ).orElseThrow();

        if (!admin) {
            return res.status(404).send({
                success: false,
                message: config.messages.adminNotFoundWithNameOrEmail,
            });
        }

        if (admin && admin.user.password !== data.password) {
            return res.status(400).send({
                success: false,
                message: config.messages.wrongPassword,
            });
        }

        const { expiresAt, token } = (
            await authService.saveNewUserToken(admin.user.id!)
        ).orElseThrow((error) => {
            return config.project.environment === 'production'
                ? 'Os dados foram preenchidos corretamente, mas não foi possível completar a autenticação'
                : error.message;
        });

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
