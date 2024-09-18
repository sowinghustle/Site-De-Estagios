import Joi from 'joi';
import { NameOrEmailSchema, PasswordSchema } from '../config/joi';

export const AdminLoginSchema = Joi.object<{
    nameOrEmail: string;
    password: string;
}>({
    nameOrEmail: NameOrEmailSchema,
    password: PasswordSchema,
});
