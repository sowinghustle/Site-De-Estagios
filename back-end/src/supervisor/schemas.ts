import Joi from 'joi';
import { EmailSchema, NameSchema, PasswordSchema } from '../config/joi';

export const SupervisorLoginSchema = Joi.object<{
    email: string;
    password: string;
}>({
    email: EmailSchema.required(),
    password: PasswordSchema.required(),
});

export const SupervisorRegisterSchema = Joi.object<{
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}>({
    name: NameSchema.required(),
    email: EmailSchema.required(),
    password: PasswordSchema.required(),
    passwordConfirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirmar senha')
        .options({
            messages: { 'any.only': 'A confirmação de senha está incorreta' },
        }),
});
