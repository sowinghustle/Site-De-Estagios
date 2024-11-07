import Joi from 'joi';
import {
    EmailSchema,
    NameSchema,
    PasswordSchema,
    RepeatPasswordSchema,
} from '.';

export const SupervisorLoginSchema = Joi.object<{
    email: string;
    password: string;
}>({
    email: EmailSchema,
    password: PasswordSchema,
});

export const SupervisorRegisterSchema = Joi.object<{
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
}>({
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    repeatPassword: RepeatPasswordSchema,
});
