import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { BadRequestError, NotFoundError } from '../config/errors';
import { getValidationResult } from '../config/utils';
import userService from '../user/service';
import { SupervisorLoginSchema, SupervisorRegisterSchema } from './schemas';
import supervisorService from './service';

export default class SupervisorController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(
            SupervisorLoginSchema,
            req.body
        ).orElseThrow();

        const supervisor = (
            await supervisorService.findSupervisorByEmail(data.email)
        ).orElseThrow();

        if (!supervisor) {
            throw new NotFoundError(
                config.messages.supervisorNotFoundWithEmail
            );
        }

        if (
            !(await userService.comparePassword(supervisor.user, data.password))
        ) {
            throw new BadRequestError(config.messages.wrongPassword);
        }

        const { token, expiresAt } = (
            await authService.saveNewUserToken(supervisor.user.id!)
        ).orElseThrow((err) =>
            config.project.environment === 'production'
                ? 'Não foi possível realizar o login, tente novamente mais tarde.'
                : err.message
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

    async register(req: Request, res: Response) {
        const data = getValidationResult(
            SupervisorRegisterSchema,
            req.body
        ).orElseThrow();

        (
            await supervisorService.saveNewSupervisor({
                name: data.name,
                user: {
                    email: data.email,
                    password: data.password,
                },
            })
        ).orElseThrow((err) =>
            config.project.environment === 'production'
                ? 'Os dados foram preenchidos corretamente, mas não foi possível completar o registro'
                : err.message
        );

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}
