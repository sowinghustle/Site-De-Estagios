import Joi from 'joi';
import { AdminNameOrEmailSchema, PasswordSchema } from '.';

export const AdminLoginSchema = Joi.object<{
    nameOrEmail: string;
    password: string;
}>({
    nameOrEmail: AdminNameOrEmailSchema,
    password: PasswordSchema,
});
