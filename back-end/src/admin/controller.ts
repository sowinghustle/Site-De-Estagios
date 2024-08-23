import { CookieOptions, Request, Response } from 'express';
import { LoginAdmin } from './dto';
import adminService from './service';
import authService from '../auth/service';
import project from '../config/project';
import responseMessages from '../config/responseMessages';
import instituition from '../config/instituition';

export default class AdminController {
    async login(req: Request, res: Response) {
        const { nameOrEmail, password } = req.body as LoginAdmin;

        if (typeof nameOrEmail !== 'string') {
            return res.status(400).send({
                success: false,
                message: 'É necessário enviar o nome ou email do administrador',
            });
        }

        if (typeof password !== 'string') {
            return res.status(400).send({
                success: false,
                message: 'É necessário preencher a senha do administrador',
            });
        }

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
        }

        return res
            .status(200)
            .cookie('token', saveUserTokenResult.userToken.token)
            .send({
                success: true,
                expiresAt: saveUserTokenResult.userToken.expiresAt,
                message: responseMessages.successfullLogin,
                token: saveUserTokenResult.userToken.token,
            });
    }
}
