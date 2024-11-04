import Joi from 'joi';
import {
    EmailSchema,
    PasswordSchema,
    ResetPasswordTokenSchema,
} from '../modules/config/joi';

export const ForgotPasswordSchema = Joi.object<{ email: string }>({
    email: EmailSchema,
});

export const ResetPasswordSchema = Joi.object<{
    email: string;
    token: string;
    newPassword: string;
}>({
    email: EmailSchema,
    token: ResetPasswordTokenSchema,
    newPassword: PasswordSchema,
});
