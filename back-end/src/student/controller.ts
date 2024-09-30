import { Request, Response } from 'express';
import authService from '../auth/service';
import config from '../config';
import { BadRequestError, NotFoundError } from '../config/errors';
import { getValidationResult } from '../config/utils';
import userService from '../user/service';
import { StudentLoginSchema, StudentRegisterSchema } from './schemas';
import studentService from './service';

export default class StudentController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(
            StudentLoginSchema,
            req.body
        ).orElseThrow();

        const student = (
            await studentService.findStudentByEmail(data.email)
        ).orElseThrow();

        if (!student) {
            throw new NotFoundError(config.messages.studentNotFoundWithEmail);
        }

        if (!(await userService.comparePassword(student.user, data.password))) {
            throw new BadRequestError(config.messages.wrongPassword);
        }

        const { token, expiresAt } = (
            await authService.saveNewUserToken(student.user.id!)
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
            StudentRegisterSchema,
            req.body
        ).orElseThrow();

        (
            await studentService.saveNewStudent({
                fullName: data.fullName,
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
