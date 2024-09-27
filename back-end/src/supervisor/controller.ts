import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { getValidationResult } from '../config/utils';
import { SupervisorLoginSchema, SupervisorRegisterSchema } from './schemas';
import supervisorService from './service';
import emailService from '../email/service'; // Importando o serviço de email

export default class SupervisorController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(
            res,
            SupervisorLoginSchema.validate(req.body)
        );

        if (!data) return res.end();

        const supervisor = (
            await supervisorService.findSupervisorByEmail(data.email)
        ).orElseThrow();

        if (!supervisor) {
            return res.status(404).send({
                success: false,
                message: config.messages.supervisorNotFoundWithEmail,
            });
        }

        if (supervisor.user.password !== data.password) {
            return res.status(400).send({
                success: false,
                message: config.messages.wrongPassword,
            });
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
            res,
            SupervisorRegisterSchema.validate(req.body)
        );

        if (!data) return res.end();

        const supervisor = (
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

        // Enviar email de boas-vindas
        const emailResult = await emailService.sendNewUserEmail(data.email);

        if (!emailResult.success) {
            return res.status(500).send({
                success: false,
                message: 'Falha ao enviar email de boas-vindas.',
            });
        }

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}
