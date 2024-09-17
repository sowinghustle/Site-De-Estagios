import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { handleValidationResult } from '../config/utils';
import { AdminLoginSchema } from './schemas';
import adminService from './service';

export default class AdminController {
    async login(req: Request, res: Response) {
        const data = handleValidationResult(
            res,
            AdminLoginSchema.validate(req.body)
        );

        if (!data) return res.end();

        const { admin, error } =
            await adminService.findAdminByNameOrEmailAndPassword({
                nameOrEmail: data.nameOrEmail,
                password: data.password,
            });

        if (error) {
            return res.status(400).send({
                success: false,
                message: error.message,
            });
        }

        const saveUserTokenResult = await authService.saveNewUserToken(
            admin.user.id!
        );

        if (saveUserTokenResult.error) {
            return res.status(500).send({
                success: false,
                message:
                    config.project.environment === 'production'
                        ? 'Os dados foram preenchidos corretamente, mas não foi possível completar a autenticação'
                        : saveUserTokenResult.error.message,
            });
        }

        return res
            .status(200)
            .cookie(
                'token',
                saveUserTokenResult.userToken.token,
                config.project.cookieOptions
            )
            .send({
                success: true,
                expiresAt: saveUserTokenResult.userToken.expiresAt,
                message: config.messages.successfullLogin,
                token: saveUserTokenResult.userToken.token,
            });
    }
}
