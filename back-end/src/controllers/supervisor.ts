import { Request, Response } from 'express';
import { Supervisor } from '../models/supervisor';
import config from '../modules/config';
import { NotFoundError, UnhandledError } from '../modules/config/errors';
import { getValidationResult, toResult } from '../modules/config/utils';
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
        const data = getValidationResult(SupervisorLoginSchema, req.body);
        const supervisor = await toResult(
            supervisorService.findSupervisorByEmail(data.email)
        )
            .validateAsync<Supervisor>(
                (student) => !!student,
                new NotFoundError(config.messages.supervisorNotFoundWithEmail)
            )
            .orElseThrowAsync();

        await userService.ensurePasswordsMatchAsync(
            supervisor.user,
            data.password
        );

        const accessToken = await toResult(
            authService.saveNewAccessToken(supervisor.user.id!)
        ).orElseThrowAsync(
            (error) =>
                new UnhandledError(
                    error.message,
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

    async register(req: Request, res: Response) {
        const data = getValidationResult(SupervisorRegisterSchema, req.body);
        const supervisor = await toResult(
            supervisorService.saveNewSupervisor({
                name: data.name,
                user: {
                    email: data.email,
                    password: data.password,
                },
            })
        ).orElseThrowAsync(
            (error) =>
                new UnhandledError(
                    error.message,
                    'Os dados foram preenchidos corretamente, mas não foi possível completar o registro.'
                )
        );

        await toResult(
            emailService.sendNewUserEmail(supervisor.user)
        ).getValueAsync();

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}
