import Joi from 'joi';
import {
    EmailSchema,
    NameSchema,
    PasswordSchema,
    RepeatPasswordSchema,
} from '../config/joi';

export const StudentLoginSchema = Joi.object<{
    email: string;
    password: string;
}>({
    email: EmailSchema,
    password: PasswordSchema,
});

export const StudentRegisterSchema = Joi.object<{
    fullName: string;
    email: string;
    password: string;
    repeatPassword: string;
}>({
    fullName: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    repeatPassword: RepeatPasswordSchema,
});
