import { CookieOptions, Request, Response } from 'express';
import adminService from './service';
import authService from '../auth/service';
import project from '../config/project';

export default class AdminController {
    async login(req: Request, res: Response) {
        const { nameOrEmail, password } = req.body;
        const { admin, error } =
            await adminService.findAdminByNameOrEmailAndPassword(
                nameOrEmail,
                password
            );

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        const saveUserTokenResult = await authService.saveNewUserToken(
            admin.user.id!
        );

        if (saveUserTokenResult.error) {
            return {
                success: false,
                message: saveUserTokenResult.error.message,
            };
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

        res.cookie('token', saveUserTokenResult.userToken.token);

        return {
            success: true,
            expiresAt: saveUserTokenResult.userToken.expiresAt,
            message: 'Login realizado com sucesso!',
        };
    }
}
