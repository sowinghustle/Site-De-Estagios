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
    email: EmailSchema.required(),
    password: PasswordSchema.required(),
});

export const StudentRegisterSchema = Joi.object<{
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
}>({
    name: NameSchema.required(),
    email: EmailSchema.required(),
    password: PasswordSchema.required(),
    repeatPassword: RepeatPasswordSchema.required(),
});
