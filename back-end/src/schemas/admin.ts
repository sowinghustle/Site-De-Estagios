import Joi from 'joi';
import { AdminNameOrEmailSchema, PasswordSchema } from '../modules/config/joi';

export const AdminLoginSchema = Joi.object<{
    nameOrEmail: string;
    password: string;
}>({
    nameOrEmail: AdminNameOrEmailSchema,
    password: PasswordSchema,
});
