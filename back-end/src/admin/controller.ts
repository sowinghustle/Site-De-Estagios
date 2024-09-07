import { CookieOptions, Request, Response } from 'express';
import { LoginAdminDto } from './dto';
import adminService from './service';
import authService from '../auth/service';
import project from '../config/project';
import responseMessages from '../config/responseMessages';
import { AdminLoginSchema } from './schemas';

export default class AdminController {
    async login(req: Request, res: Response) {
        try {
            const validateResult = AdminLoginSchema.validate(req.body);

            if (validateResult.error) {
                return res.status(400).send({
                    success: false,
                    message: validateResult.error.message,
                });
            }

            const { nameOrEmail, password } =
                validateResult.value as LoginAdminDto;
            const { admin, error } =
                await adminService.findAdminByNameOrEmailAndPassword({
                    nameOrEmail: nameOrEmail.trim(),
                    password: password,
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
                        project.environment === 'production'
                            ? 'Os dados foram preenchidos corretamente, mas não foi possível completar a autenticação'
                            : saveUserTokenResult.error.message,
                });
            }

            const options: CookieOptions = {
                maxAge: 1000 * 60 * 30,
                httpOnly: true,
                signed: false,
            };

            if (project.environment == 'production') {
                options.signed = true;
                options.secure = true;
                options.sameSite = 'strict';
            }

            return res
                .status(200)
                .cookie('token', saveUserTokenResult.userToken.token, options)
                .send({
                    success: true,
                    expiresAt: saveUserTokenResult.userToken.expiresAt,
                    message: responseMessages.successfullLogin,
                    token: saveUserTokenResult.userToken.token,
                });
        } catch (err) {
            return res.status(500).send({
                success: false,
                message: 'Erro interno no servidor',
            });
        }
    }
}
