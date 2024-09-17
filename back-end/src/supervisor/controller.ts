import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { handleValidationResult } from '../config/utils';
import { SupervisorLoginSchema, SupervisorRegisterSchema } from './schemas';
import supervisorService from './service';

export default class SupervisorController {
    async login(req: Request, res: Response) {
        const data = handleValidationResult(
            res,
            SupervisorLoginSchema.validate(req.body)
        );

        if (!data) return res.end();

        const { supervisor, error } =
            await supervisorService.findSupervisorEmailAndPassword({
                email: data.email,
                password: data.password,
            });

        if (error) {
            return res.status(400).send({
                success: false,
                message: error.message,
            });
        }

        const saveUserTokenResult = await authService.saveNewUserToken(
            supervisor.user.id!
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

    async register(req: Request, res: Response) {
        const data = handleValidationResult(
            res,
            SupervisorRegisterSchema.validate(req.body)
        );

        if (!data) return res.end();

        const createSupervisorResult =
            await supervisorService.saveNewSupervisor({
                name: data.name,
                user: {
                    email: data.email,
                    password: data.password,
                },
            });

        if (createSupervisorResult.error) {
            return res.status(500).send({
                success: false,
                message:
                    config.project.environment === 'production'
                        ? 'Os dados foram preenchidos corretamente, mas não foi possível completar o registro'
                        : createSupervisorResult.error.message,
            });
        }

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}
