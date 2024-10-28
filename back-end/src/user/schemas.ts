import Joi from 'joi';
import {
    EmailSchema,
    PasswordSchema,
    ResetPasswordTokenSchema,
} from '../config/joi';

export const ForgotPasswordSchema = Joi.object<{ email: string }>({
    email: EmailSchema,
});

export const ResetPasswordSchema = Joi.object<{
    token: string;
    newPassword: string;
}>({
    token: ResetPasswordTokenSchema,
    newPassword: PasswordSchema,
});
