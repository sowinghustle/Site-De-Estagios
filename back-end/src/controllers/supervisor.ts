import { Request, Response } from 'express';
import config from '../config';
import {
    BadRequestError,
    NotFoundError,
    UnhandledError,
} from '../config/errors';
import { getValidationResult, toPromiseResult } from '../config/utils';
import {
    SupervisorLoginSchema,
    SupervisorRegisterSchema,
} from '../schemas/supervisor';
import authService from '../services/auth';
import emailService from '../services/email';
import supervisorService from '../services/supervisor';
import userService from '../services/user';

export default class SupervisorController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(
            SupervisorLoginSchema,
            req.body
        ).orElseThrow();

        const supervisor = await toPromiseResult(
            supervisorService.findSupervisorByEmail(data.email)
        ).orElseThrow();

        if (!supervisor) {
            throw new NotFoundError(
                config.messages.supervisorNotFoundWithEmail
            );
        }

        if (
            !(await userService.comparePasswordsAsync(
                supervisor.user,
                data.password
            ))
        ) {
            throw new BadRequestError(config.messages.wrongPassword);
        }

        const { token, expiresAt } = await toPromiseResult(
            authService.saveNewAccessToken(supervisor.user.id!)
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

    async register(req: Request, res: Response) {
        const data = getValidationResult(
            SupervisorRegisterSchema,
            req.body
        ).orElseThrow();

        const supervisor = await toPromiseResult(
            supervisorService.saveNewSupervisor({
                name: data.name,
                user: {
                    email: data.email,
                    password: data.password,
                },
            })
        ).orElseThrow(
            (error) =>
                new UnhandledError(
                    error.message,
                    'Os dados foram preenchidos corretamente, mas não foi possível completar o registro.'
                )
        );

        await emailService.sendNewUserEmail(supervisor.user);

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}
